package com.priority.tasktracker.llm.yandex.domain

import com.fasterxml.jackson.databind.ObjectMapper
import com.priority.tasktracker.llm.LlmService
import com.priority.tasktracker.llm.yandex.domain.model.request.YaBody
import com.priority.tasktracker.llm.yandex.domain.model.request.YaOptions
import com.priority.tasktracker.llm.yandex.domain.model.response.Message
import com.priority.tasktracker.task.domain.model.Task
import com.priority.tasktracker.utils.DateUtils.Companion.mskLocalDate
import com.priority.tasktracker.utils.WithLogging
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class YandexLlmService(
    @Value("\${ya.folder-id}") val folderId: String,
    @Value("\${ya.model}") val model: String,
    private val yaClient: YaClient,
) : LlmService {
    private val objectMapper: ObjectMapper = ObjectMapper()

    override fun createTask(title: String, tasksContext: List<Task>): Task? {

        // попробовать передавать ему список существующих задач, мб будет интересно
        val initMessage = Message(role = "user", text = title)
        val body = YaBody(
            modelUri = "gpt://$folderId$model",
            completionOptions = YaOptions(),
            messages = mutableListOf(systemPrompt, initMessage)
        )

        val result = call(body)
        val resultText = result.text.substringAfter("{").substringBeforeLast("}").let { "{$it}" }
        var taskParams: TaskParams = TaskParams.empty()
        runCatching {
            taskParams = objectMapper.readValue(resultText, TaskParams::class.java)
        }.onFailure {
            logger.warn("Error when parsing LLM response: ${result.text}")
            return null
        }

        return Task(
            title = title,
            date = mskLocalDate(),
            urgency = taskParams.urgency,
            personalInterest = taskParams.personalInterest,
            executionTime = taskParams.executionTime,
            complexity = taskParams.complexity,
            concentration = taskParams.concentration
        )
    }

    private fun call(body: YaBody): Message {
        logger.info("Sending message to model")
        return yaClient.call(body).alternatives[0].message
            .also { println("Model response\n: $it") }
    }

    companion object : WithLogging() {
        private val systemPrompt = Message(
            role = "system",
            text = """
Ты — автоматический агент, встроенный в тасктрекер.
На вход ты получаешь название задачи от пользователя.
На выход ты должен сгенерировать строку с JSON-объектом, где проставлены числовые значения параметров задачи.

Описание параметров:
  urgency: [
    '10 – нужно было сделать ещё вчера',
    '9 – сегодня до конца дня',
    '8 – завтра утром край',
    '7 – в течение 2–3 дней',
    '6 – желательно на этой неделе',
    '5 – неделя-другая, без жёсткого дедлайна',
    '4 – можно отложить до следующего месяца',
    '3 – через месяц — не проблема',
    '2 – когда-нибудь потом',
    '1 – неважно когда, можно забыть',
  ],
  personalInterest: [
    '10 – вдохновляет: хочу сделать прямо сейчас',
    '9 – очень хочется сделать, вызывает азарт',
    '8 – нравится задача, приятная',
    '7 – делать можно, умеренный интерес',
    '6 – не вызывает эмоций, но не против',
    '5 – нейтрально, может быть скучно',
    '4 – немного отталкивает, откладываю',
    '3 – не хочется, делаю через силу',
    '2 – очень не хочется, вызывает раздражение',
    '1 – не хочу',
  ],
  executionTime: [
    '10 – меньше 5 минут',
    '9 – 5–15 минут',
    '8 – до 30 минут',
    '7 – 30–60 минут',
    '6 – 1–2 часа',
    '5 – 2–3 часа',
    '4 – полдня',
    '3 – один рабочий день',
    '2 – несколько дней',
    '1 – неделя и больше',
  ],
  complexity: [
    '10 – всё предельно понятно и элементарно',
    '9 – понятно, но надо чуть подумать',
    '8 – есть пара неопределённостей, но в целом ясно',
    '7 – почти ясно, надо уточнить пару моментов',
    '6 – есть препятствия, нужно готовиться',
    '5 – требует размышлений и усилий',
    '4 – много неясного, сложно начать',
    '3 – почти не понимаю, как делать',
    '2 – очень туманно, чувствую тупик',
    '1 – полная неизвестность, не знаю с чего начать',
  ],
  concentration: [
    '10 — Максимальный фокус, полная тишина, любые отвлечения мешают',
    '9 — Почти как 10, лучше без уведомлений и разговоров',
    '8 — Внимание важно, можно короткие паузы, музыка — мешает',
    '7 — Желательно не отвлекаться, музыка без слов — допустима',
    '6 — Можно прерываться, легкая фоновая музыка не помеха',
    '5 — Умеренный фокус, подойдёт музыка или спокойное видео',
    '4 — Делается с параллельными задачами, можно сериал на фоне',
    '3 — Фоновая задача, подходит под подкаст или фильм',
    '2 — Почти не требует внимания, можно делать, слушая и глядя в другое',
    '1 — Автопилот, подходит под сериалы, разговоры, фоновые шоу',
  ].
Итоговый вес задачи оценивается по формуле
  weight = urgency * 2.6 + personalInterest * 1.6 + executionTime * 2.5 + complexity * 1.2 + concentration * 2.1) / 10
То есть параметры, которые наиболее сильно влияют на вес задачи по убыванию:
  urgency, executionTime, concentration, personalInterest, complexity
Формат строго фиксированный.
Никаких Markdown-блоков.
Никаких тройных кавычек.
Никаких символов до или после JSON.
Ответ должен начинаться с { и заканчиваться }.
Это критично.
Пример правильного ответа (и единственно допустимого):
{“urgency”:7,“personalInterest”:6,“executionTime”:4,“complexity”:6,“concentration”:6}

Не используй ни ``` ни кавычек. Ответ — ровно одна строка с JSON-объектом.
            """.trimIndent()
        )
    }

}