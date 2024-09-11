import { useState, useRef, useEffect } from "react";

const BackgroundMusic = ({ Align }) => {
	const [isMuted, setIsMuted] = useState(true);
	const audioRef = useRef(null);

	useEffect(() => {
		const audio = audioRef.current;

		const playAudio = () => {
			audio.play().catch((error) => {
				console.error("Autoplay was prevented:", error);
			});
		};

		const handleFirstInteraction = () => {
			playAudio();
			document.removeEventListener("click", handleFirstInteraction);
			document.removeEventListener("keydown", handleFirstInteraction);
		};

		document.addEventListener("click", handleFirstInteraction);
		document.addEventListener("keydown", handleFirstInteraction);

		return () => {
			document.removeEventListener("click", handleFirstInteraction);
			document.removeEventListener("keydown", handleFirstInteraction);
		};
	}, []);

	useEffect(() => {
		audioRef.current.muted = isMuted;
		audioRef.current.volume = 0.007;
	}, [isMuted]);

	const toggleMute = () => {
		setIsMuted(!isMuted);
	};

	return (
		<div className='fixed top-4 right-4'>
			<audio ref={audioRef} src='src/assets/music.mp3' loop />
			<button className='btn btn-square' onClick={toggleMute}>
				<img
					src={
						isMuted
							? "src/assets/MusicNoteCross.png"
							: "src/assets/MusicNote.png"
					}
					alt='music'
					className={`w-12 h-12 fixed ${Align}`}
				/>
			</button>
		</div>
	);
};

export default BackgroundMusic;
