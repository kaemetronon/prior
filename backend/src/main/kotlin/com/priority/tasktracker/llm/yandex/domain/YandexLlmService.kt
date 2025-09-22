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
            description = "LLM Vibes",
            date = mskLocalDate(),
            importance = taskParams.importance,
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
<role>
Ты — автоматический агент, встроенный в таск-трекер. Твоя задача — по короткому описанию задачи от пользователя создать валидный json со следующими полями: importance, urgency, personalInterest, executionTime, complexity, concentration. и оценками 1-10 для каждого.
</role>
<context>
Шкалы параметров (1..10, целые):
importance: [
  '10 – Критически важно для жизни/карьеры/бизнеса; без этого рушатся цели',
  '9 – Сильно влияет на ключевые результаты и долгосрочные метрики',
  '8 – Существенно продвигает стратегические цели/компетенции',
  '7 – Заметно улучшает результат или снижает серьёзные риски',
  '6 – Полезно, создаёт ощутимую ценность, но можно отложить',
  '5 – Средняя важность; неплохо сделать, но не меняет картину',
  '4 – Низкая важность; локальные улучшения/удобства',
  '3 – Почти не влияет на цели; косметика',
  '2 – Формальность/ритуал; можно исключить без последствий',
  '1 – Не имеет значения; смело вычеркивать',
],
urgency: [
  '10 – Просрочено; нужно немедленно',
  '9 – Сегодня, в ближайшие часы',
  '8 – Сегодня до конца дня',
  '7 – Завтра',
  '6 – В течение 2–3 дней',
  '5 – На этой неделе',
  '4 – В течение месяца',
  '3 – В течение квартала',
  '2 – Когда-нибудь; чёткого срока нет',
  '1 – Можно забыть; срока нет и не нужен',
],
personalInterest: [
  '10 – Горю желанием, вдохновляет, делаю с радостью',
  '9 – Очень хочется, вызывает азарт',
  '8 – Нравится, приятно делать',
  '7 – Нормально, умеренный интерес',
  '6 – Нейтрально, могу сделать без эмоций',
  '5 – Лёгкая скука, лучше бы другое',
  '4 – Отталкивает, но возможно',
  '3 – Не хочу, делаю только из-под палки',
  '2 – Очень неприятно, сильное сопротивление',
  '1 – Категорически не хочу',
],
executionTime: [
  '10 – До 5 минут (мгновенно)',
  '9 – До 15 минут',
  '8 – До 30 минут',
  '7 – 30–60 минут',
  '6 – 1–2 часа',
  '5 – Полдня (3–4 часа)',
  '4 – Рабочий день (5–8 часов)',
  '3 – Несколько дней (2–3)',
  '2 – Неделя',
  '1 – Больше недели',
],
complexity: [
  '10 – Всё элементарно, сразу понятно',
  '9 – Почти элементарно, требуется минимальное внимание',
  '8 – Пара мелких уточнений, в целом ясно',
  '7 – Есть нюансы, но понимаю, как сделать',
  '6 – Потребуется подготовка и усилия',
  '5 – Есть трудности, но дорога в целом ясна',
  '4 – Много неизвестного, предстоит разбираться',
  '3 – Слабо понимаю, с чего начать',
  '2 – Очень туманно, нужен ресёрч или помощь',
  '1 – Полная неизвестность, нет идей как решать',
],
concentration: [
  '10 – Абсолютный фокус: тишина, отключённые уведомления',
  '9 – Сильная концентрация: лучше в тишине, но можно с лёгким фоном',
  '8 – Важно внимание, допустим таймер и короткие паузы',
  '7 – Желательно без отвлечений, но музыка без слов возможна',
  '6 – Можно прерываться, лёгкий фон не мешает',
  '5 – Средний фокус, можно работать под музыку или спокойное видео',
  '4 – Допустимо совмещать с параллельными делами',
  '3 – Подходит под подкаст или фильм на фоне',
  '2 – Почти без внимания, можно совмещать с разговорами',
  '1 – Автопилот: делается машинально',
]
</context>
<task>
По краткому описанию задачи (одно-два предложения, иногда с пометками «важно/срочно/не срочно/быстро/сложно/на автопилоте» и т.п.) вернуть ровно одну строку с корректным JSON-объектом из 6 полей: importance, urgency, personalInterest, executionTime, complexity, concentration. Все значения — целые числа в диапазоне 1..10.
</task>
<instruction>
Жёстко следуй сигналам пользователя, пользователь может просто сказать - поставь все десятки и тд - надо делать так.
</instruction>
<json_formatting>
Формат строго фиксированный.
Никаких Markdown-блоков.
Никаких тройных кавычек.
Никаких символов до или после JSON.
Ответ должен начинаться с { и заканчиваться }.
Это критично.
Пример правильного ответа (и единственно допустимого):
{"importance": 6,“urgency”:7,“personalInterest”:6,“executionTime”:4,“complexity”:6,“concentration”:6}
</json_formatting>
<output_format>
Строго одна строка валидного JSON:
{"importance":X,"urgency":Y,"personalInterest":Z,"executionTime":A,"complexity":B,"concentration":C}
Где X..C — целые числа 1..10. Используй только стандартные ASCII-двойные кавычки для ключей, без «умных» кавычек.
</output_format>
ВАЖНО - Не используй ни ``` ни кавычек. Ответ — ровно одна строка с JSON-объектом.
            """.trimIndent()
        )
    }

}