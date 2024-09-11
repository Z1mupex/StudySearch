import { useState, useEffect, useRef } from "react";
import Groq from "groq-sdk";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { FiMenu, FiX, FiSend, FiCheckSquare } from "react-icons/fi";
import Modal from "./components/Modal";
import Quiz from "./components/Quiz";
import ThemeOfTheDay from "./components/ThemeOfTheDay";
import BackgroundMusic from "./components/BackgroundMusic";

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

const groq = new Groq({
	apiKey: apiKey,
	dangerouslyAllowBrowser: true,
});

export default function StudySearch() {
	const [chatMessages, setChatMessages] = useState([
		{
			role: "assistant",
			content:
				"Привет! Я являюсь твоим помощником в учебе! Со мной ты можешь узнать новое о различных вещах. Например, наведись на любое слово в моем сообщении, так ты получишь дополнительную информацию о слове, если оно тебе не понятно.",
		},
	]);
	const [userMessage, setUserMessage] = useState("");
	const [tooltipContent, setTooltipContent] = useState({});
	const [showQuiz, setShowQuiz] = useState(false);
	const chatContainerRef = useRef(null);
	const [showToast, setShowToast] = useState(true);
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [chatMessages]);

	const getGroqChatCompletion = async (messages) => {
		try {
			const chatCompletion = await groq.chat.completions.create({
				messages: [
					{
						role: "system",
						content:
							"Ты умный и полезный помощник и ответишь на любую тему, которую тебе зададут. Ты должен будешь предоставить краткую информацию (не более 80 слов). Имей в виду, что это должно быть понятно человеку, кто еще не изучал это, либо изучал поверхностно, либо забыл.",
					},
					// {
					// 	role: "user",
					// 	content: message,
					// },
					...messages,
				],
				model: "mixtral-8x7b-32768",
				temperature: 1,
				max_tokens: 1024,
			});

			if (
				chatCompletion &&
				chatCompletion.choices &&
				chatCompletion.choices.length > 0
			) {
				return (
					chatCompletion.choices[0].message?.content ||
					"Извините, произошла ошибка при получении ответа."
				);
			} else {
				throw new Error("No choices available in the response.");
			}
		} catch (error) {
			console.error("Error getting chat completion:", error);
			return "Извините, произошла ошибка при получении ответа.";
		}
	};

	const handleChatSubmit = async (e) => {
		e.preventDefault();
		if (userMessage.trim() === "") return;

		const newUserMessage = { role: "user", content: userMessage };
		const updatedMessages = [...chatMessages, newUserMessage];

		setChatMessages(updatedMessages);
		setUserMessage("");

		const assistantResponse = await getGroqChatCompletion(updatedMessages);
		const newAssistantMessage = {
			role: "assistant",
			content: assistantResponse,
		};

		setChatMessages([...updatedMessages, newAssistantMessage]);
	};

	const handleWordHover = async (word) => {
		if (tooltipContent[word]) return;

		const tooltipContext = [
			{
				role: "user",
				content: `Дай краткую информацию о слове: ${word}`,
			},
		];

		const tooltipText = await getGroqChatCompletion(tooltipContext);
		setTooltipContent((prev) => ({ ...prev, [word]: tooltipText }));
	};

	return (
		<div className='bg-gray-800 text-gray-200 font-sans'>
			<div className='sm:block hidden'>
				{showToast && (
					<div
						id='toast-default'
						className='fixed flex items-center w-full md:max-w-[280px] sm:max-w-56 p-4 rounded-xl shadow text-gray-200 bg-gray-900 top-5 left-5'
						role='alert'
					>
						<div className='inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-blue-800 text-blue-200'>
							<svg
								className='w-4 h-4'
								aria-hidden='true'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 18 20'
							>
								<path
									stroke='currentColor'
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z'
								/>
							</svg>
							<span className='sr-only'>Fire icon</span>
						</div>
						<ThemeOfTheDay />
						<button
							type='button'
							className='ms-auto -mx-1.5 -my-1.5 rounded-xl focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex items-center justify-center h-8 w-8 text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700'
							onClick={() => setShowToast(false)}
							aria-label='Close'
						>
							<span className='sr-only'>Close</span>
							<svg
								className='w-3 h-3'
								aria-hidden='true'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 14 14'
							>
								<path
									stroke='currentColor'
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
								/>
							</svg>
						</button>
					</div>
				)}
			</div>

			<div className='h-[10vh]'>
				<h1 className='p-2 pt-5 mb-4 flex text-center justify-center font-logo text-3xl'>
					StudySearch
				</h1>
			</div>
			{/* <Dropdown /> */}
			<button
				className='fixed top-5 right-5 z-50 text-gray-200 bg-gray-700 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-800 rounded-full p-2 block md:hidden'
				onClick={toggleMenu}
			>
				{isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
			</button>
			<div className='hidden md:block'>
				<BackgroundMusic Align={"right-36 top-5"} />
				<button
					type='button'
					className='border text-blue-500 hover:text-white hover:bg-blue-500
					focus:ring-4 focus:outline-none  font-medium rounded-[8px] text-sm px-5 
					py-2.5 text-center me-2 mb-2 border-blue-500 focus:ring-blue-800
					right-0 top-5 fixed'
					onClick={setShowQuiz}
				>
					Начать тест
				</button>
			</div>
			{isOpen && (
				<div className='fixed top-0 left-0'>
					<BackgroundMusic Align={"top-24 right-5"} />
					<button
						type='button'
						className='top-32 right-2 fixed px-5 py-2.5 text-center mb-2 mt-5 text-black'
						onClick={() => {
							setShowQuiz(true);
							toggleMenu(); // Закрыть меню после нажатия кнопки
						}}
					>
						<FiCheckSquare size={28} />
					</button>
				</div>
			)}
			<div className='flex flex-col h-[90vh]'>
				<div className=''>
					<div className='flex-grow'>
						<Modal
							isOpen={showQuiz}
							onClose={() => setShowQuiz(false)}
						>
							<Quiz />
						</Modal>
					</div>
				</div>
				<div
					className='flex-grow overflow-y-auto p-4'
					ref={chatContainerRef}
				>
					{chatMessages.map((msg, index) => (
						<div
							key={index}
							className={`mb-2  ${
								msg.role === "user" ? "text-right" : ""
							}`}
						>
							<span
								className={`inline-block p-2 rounded-2xl max-w-xs sm:max-w-md lg-max-w-lg md:max-w-xl lg:max-w-2xlт ${
									msg.role === "user"
										? "bg-blue-600 text-white"
										: "bg-gray-700 text-gray-200"
								}`}
							>
								{msg.role === "user"
									? msg.content
									: msg.content
											.split(" ")
											.map((word, idx) => (
												<Tippy
													content={
														tooltipContent[word] ||
														"Загрузка..."
													}
													onShow={() =>
														handleWordHover(word)
													}
													key={idx}
												>
													<span>{word} </span>
												</Tippy>
											))}
							</span>
						</div>
					))}
				</div>
				<form
					onSubmit={handleChatSubmit}
					className='p-4 bg-gray-700 flex items-center'
				>
					<div className='relative flex-grow'>
						<input
							type='text'
							value={userMessage}
							onChange={(e) => setUserMessage(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") handleChatSubmit(e);
							}}
							placeholder='Напишите сообщение...'
							className='w-full p-2 pr-10 rounded-xl bg-gray-600 text-white outline-none focus:ring focus:ring-blue-500'
						/>
						<button
							type='submit'
							className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white'
						>
							<FiSend size={20} />
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
