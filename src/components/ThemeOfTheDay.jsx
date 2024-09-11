import { useState, useEffect } from "react";

const topics = [
	"Интегралы",
	"Физика: законы Ньютона",
	"История Древнего Рима",
	"Орфография русского языка",
	"Химические реакции",
	"Геометрия: треугольники",
	"Литература: анализ стихотворений",
	"География: материки и океаны",
	"Биология: строение клетки",
	"Алгебра: линейные уравнения",
	"Информатика: алгоритмы",
	"Обществознание: политические системы",
	"Английский язык: времена глаголов",
	"История Второй мировой войны",
	"Геометрия: окружности",
	"Биология: экосистемы",
	"Химия: таблица Менделеева",
	"Физика: электромагнетизм",
	"Русский язык: синтаксис",
	"География: климат",
	"Литература: эпос и лирика",
	"Алгебра: квадратичные уравнения",
	"Информатика: основы программирования",
	"Обществознание: права человека",
	"Английский язык: пассивный залог",
	"История Российской империи",
];

function ThemeOfTheDay() {
	const [currentTopic, setCurrentTopic] = useState(null);
	const [remainingTopics, setRemainingTopics] = useState([...topics]);

	useEffect(() => {
		const savedTopics = JSON.parse(localStorage.getItem("remainingTopics"));
		const lastChangeTime = localStorage.getItem("lastChangeTime");

		if (
			savedTopics &&
			lastChangeTime &&
			Date.now() - lastChangeTime < 86400000
		) {
			setRemainingTopics(savedTopics);
			setCurrentTopic(savedTopics[0]);
		} else {
			updateTopic();
		}

		const interval = setInterval(() => {
			updateTopic();
		}, 86400000);

		return () => clearInterval(interval);
	}, []);

	const updateTopic = () => {
		if (remainingTopics.length > 0) {
			const newTopics = remainingTopics.slice(1);
			setRemainingTopics(newTopics);
			setCurrentTopic(remainingTopics[0]);

			localStorage.setItem("remainingTopics", JSON.stringify(newTopics));
			localStorage.setItem("lastChangeTime", Date.now());
		}
	};

	return (
		<div className='ms-3 text-sm font-normal'>
			Тема дня: <span className='font-bold'>{currentTopic}</span>
		</div>
	);
}

export default ThemeOfTheDay;
