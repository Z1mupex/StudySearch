import { useState } from "react";
import Groq from "groq-sdk";
import Checkbox from "./checkbox";

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

const groq = new Groq({
	apiKey: apiKey,
	dangerouslyAllowBrowser: true,
});

const Quiz = () => {
	const [showQuestions, setShowQuestions] = useState(false);
	const [selectedTheme, setSelectedTheme] = useState("");
	const [questions, setQuestions] = useState([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState(null);
	const [score, setScore] = useState(0);
	const [showResult, setShowResult] = useState(false);

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			getGroqChatCompletion(selectedTheme);
		}
	};

	const getGroqChatCompletion = async (theme) => {
		try {
			const chatCompletion = await groq.chat.completions.create({
				messages: [
					{
						role: "system",
						content: `Создайте вопросы для теста об основах ${theme} на русском языке.
			        Предоставьте четыре варианта ответа и укажите, какой из них правильный. Ответ должен быть в формате JSON с ключами 'question', 'options' и 'correct_answer'.
			        Количество вопросов - 10 (создать список). Без 'Вот 10 вопросов викторины в формате JSON:'`,
					},
				],
				model: "mixtral-8x7b-32768",
				temperature: 1,
				max_tokens: 2048,
			});

			// console.log(chatCompletion, "chatCompletion");

			if (
				chatCompletion &&
				chatCompletion.choices &&
				chatCompletion.choices.length > 0
			) {
				const content = chatCompletion.choices[0].message.content;
				console.log(content);
				const parsedQuestions = JSON.parse(content);
				setQuestions(parsedQuestions);
				setShowQuestions(true);
				setCurrentQuestionIndex(0);
				setSelectedAnswer(null);
				setScore(0);
				setShowResult(false);
			} else {
				throw new Error("No choices available in the response.");
			}
		} catch (error) {
			console.error("Error getting chat completion:", error);
			alert("Извините, произошла ошибка при получении ответа.");
		}
	};

	const handleAnswerSelection = (index) => {
		setSelectedAnswer(currentQuestion.options[index]);
	};

	const handleSubmit = () => {
		if (selectedAnswer !== null) {
			const currentQuestion = questions[currentQuestionIndex];
			if (selectedAnswer === currentQuestion.correct_answer) {
				setScore(score + 1);
			}

			if (currentQuestionIndex < questions.length - 1) {
				setCurrentQuestionIndex(currentQuestionIndex + 1);
				setSelectedAnswer(null);
			} else {
				setShowResult(true);
			}
		} else {
			alert("Пожалуйста, выберите ответ перед тем, как продолжить.");
		}
	};

	const restartQuiz = () => {
		setShowQuestions(false);
		setSelectedTheme("");
		setQuestions([]);
		setCurrentQuestionIndex(0);
		setSelectedAnswer(null);
		setScore(0);
		setShowResult(false);
	};

	const currentQuestion = questions[currentQuestionIndex];

	return (
		<div className='font-sans'>
			{!showQuestions && (
				<div>
					<label
						htmlFor='theme'
						className='block mb-2 text-xl font-medium text-white'
					>
						Тема теста:
					</label>
					<input
						type='text'
						id='theme'
						className='border text-sm rounded-xl block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
						placeholder='Сложение'
						value={selectedTheme}
						onChange={(event) =>
							setSelectedTheme(event.target.value)
						}
						onKeyDown={handleKeyDown}
					/>
				</div>
			)}
			{showQuestions && currentQuestion && !showResult && (
				<div>
					<h2 className='text-2xl font-bold mb-4 text-white'>
						Вопрос {currentQuestionIndex + 1} из {questions.length}
					</h2>
					<div>
						<p className='text-xl font-medium text-white mb-4'>
							{currentQuestion.question}
						</p>
						{currentQuestion.options.map((option, index) => (
							<Checkbox
								key={index}
								id={`option-${index}`}
								label={option}
								checked={selectedAnswer === index}
								onChange={() => handleAnswerSelection(index)}
							/>
						))}
					</div>
					<button
						onClick={handleSubmit}
						className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
					>
						Ответить
					</button>
				</div>
			)}
			{showResult && (
				<div className='text-white'>
					<h2 className='text-2xl font-bold mb-4'>
						Результаты теста
					</h2>
					<p className='text-xl'>
						Вы ответили правильно на {score} из {questions.length}{" "}
						вопросов.
					</p>
					<button
						onClick={restartQuiz}
						className='mt-4 px-4 py-2 bg-emerald-500 text-black font-sans text-lg rounded hover:bg-blue-600'
					>
						Начать новый тест
					</button>
				</div>
			)}
		</div>
	);
};

export default Quiz;
