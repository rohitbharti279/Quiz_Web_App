import React, { useState } from "react";
import "./App.css";
import Home from "./Components/Home";
import CreateQuiz from "./Components/CreateQuiz";
import AddQuestion from "./Components/AddQuestion";
import PreviewQuestion from "./Components/PreviewQuestion";
import Answers from "./Components/Answers";
import UserPreview from "./Components/UserPreview";
import UserAnswer from "./Components/UserAnswer";
import moon from "../src/svg/moon-regular.svg";
import sun from "../src/svg/reshot-icon-sun-energy-WL9MVB4TYD.svg";
import slide from "../src/audio/switch.mp3";

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [theme, setTheme] = useState("default");

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleBackToFirstPage = () => {
    setCurrentPage(1);
  };

  const handleImageClick = (id) => {
    setSelectedQuizId(id);
    setCurrentPage(6);
  };

  const handleThemeChange = () => {
    new Audio(slide).play();
    setTheme(theme === "default" ? "dark" : "default");
  };

  return (
    <div className={`${theme}-theme`}>
      {currentPage === 1 && (
        <>
          <div className="flex gap-3 justify-end p-2 md:text-xl xl:text-2xl">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={handleThemeChange}
              />
              <p className="slider flex gap-4 p-1">
                <img src={moon} alt="moon"></img>
                <img src={sun} alt="sun"></img>
              </p>
            </label>
          </div>
          <Home handleNext={handleNext} handleImageClick={handleImageClick} />
        </>
      )}
      {currentPage === 2 && (
        <CreateQuiz
          handleNext={handleNext}
          handlePreviousPage={handlePreviousPage}
        />
      )}
      {currentPage === 3 && <AddQuestion handleNext={handleNext} />}
      {currentPage === 4 && (
        <PreviewQuestion
          handlePreviousPage={handlePreviousPage}
          handleNext={handleNext}
        />
      )}
      {currentPage === 5 && (
        <Answers handleBackToFirstPage={handleBackToFirstPage} />
      )}
      {currentPage === 6 && (
        <UserPreview selectedQuizId={selectedQuizId} handleNext={handleNext} />
      )}
      {currentPage === 7 && (
        <UserAnswer
          selectedQuizId={selectedQuizId}
          handleBackToFirstPage={handleBackToFirstPage}
        />
      )}
    </div>
  );
};

export default App;
