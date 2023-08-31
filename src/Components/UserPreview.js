import React, { useState, useEffect } from "react";
import cross from "../svg/xmark-solid.svg";
import star from "../svg/star-solid.svg";
import activeBookmark from "../svg/bookmark-regular.svg";
import inactiveBookmark from "../svg/bookmark-solid.svg";
import play from "../svg/circle-play-regular.svg";
import stop from "../svg/circle-stop-regular.svg";

const UserPreview = ({ selectedQuizId, handleNext }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedQuestionSet, setSelectedQuestion] = useState(null);
  const questionSets = JSON.parse(localStorage.getItem("questionSets"));
  const foundQuestionSet = questionSets.find(
    (set) => set.id === parseInt(selectedQuizId)
  );

  const timeSet = foundQuestionSet.time;
  const [timeRemaining, setTimeRemaining] = useState(timeSet * 60);
  const [active, setActive] = useState(
    Array(foundQuestionSet.questions.length).fill(false)
  );

  const [readStatus, setReadStatus] = useState(
    Array(foundQuestionSet.questions.length).fill(false)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeRemaining === 0) {
      alert("The time has run out! ( समय समाप्त हो गया है| )");
      handleNextClick();
    }
  }, [timeRemaining]);

  const handleNextClick = () => {
    localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers));
    handleNext();
  };

  const handleInputChange = (questionIndex, value) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: value,
    }));
  };

  const handleClearForm = () => {
    if (window.confirm("Are you sure you want to delete all answers? 😲")) {
      setSelectedAnswers({});
    }
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const preventCopyPaste = (e) => {
    e.preventDefault();
    alert("Warning copying and pasting is not allowed!");
  };

  useEffect(() => {
    setSelectedQuestion(foundQuestionSet);

    const initialSelectedAnswers = {};
    foundQuestionSet.questions.forEach((_, questionIndex) => {
      initialSelectedAnswers[questionIndex] = "";
    });
    setSelectedAnswers(initialSelectedAnswers);
  }, [selectedQuizId]);

  const handleChangeActive = (questionIndex) => {
    setActive((previousBookmark) => {
      const newBookmark = [...previousBookmark];
      newBookmark[questionIndex] = !newBookmark[questionIndex];
      return newBookmark;
    });
  };

  const handleReadQuestion = (questionIndex) => {
    if ("speechSynthesis" in window) {
      if (readStatus[questionIndex]) {
        window.speechSynthesis.cancel();
      } else {
        const utterance = new SpeechSynthesisUtterance(
          selectedQuestionSet.questions[questionIndex].title
        );
        window.speechSynthesis.speak(utterance);
      }

      setReadStatus((prevStatus) => {
        const newStatus = [...prevStatus];
        newStatus[questionIndex] = !newStatus[questionIndex];
        return newStatus;
      });
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  return (
    <div className="relative overflow-scroll max-h-[100vh]">
      <div className="flex flex-col gap-5 bg-white rounded-lg p-2 md:p-4 md:m-8 lg:p-5 lg:m-20 xl:p-6 xl:m-24">
        <div className="flex flex-col md:flex-row justify-between gap-5 border-b pb-5">
          <p className="self-center text-[#414A53] font-semibold text-2xl xl:text-3xl">
            {foundQuestionSet.title}
          </p>
          <div className="flex flex-wrap gap-4 md:gap-5 justify-center">
            <p className="self-center text-[#414A53] font-medium text-xl xl:text-[21px]">
              {foundQuestionSet.questions.length} Questions
            </p>
            <hr className="border h-5  self-center text-[#AAADBE]"></hr>
            <p className="self-center text-red-500 font-medium text-xl xl:text-[21px]">
              ⏰ {formatTime(timeRemaining)}
            </p>
            <button
              className="relative common-button border-[#D2DAE7] border-2 rounded-md p-1 lg:ms-7 hover:bg-slate-300"
              onClick={handleClearForm}
            >
              <img src={cross} alt="cross"></img>
              <span className="absolute text-hover text-white font-medium mt-4 -ml-6 bg-slate-500 p-1 rounded-md">
                Clear Answer
              </span>
            </button>
          </div>
        </div>

        {selectedQuestionSet &&
          selectedQuestionSet.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="flex flex-col gap-3">
              <div className="flex lg:mt-3 justify-between">
                <label className="text-[#85909B] font-medium">
                  {`${(questionIndex + 1)
                    .toString()
                    .padStart(2, "0")} Question`}{" "}
                  ({question.type})
                </label>
                <div className="flex gap-2 md:gap-3">
                  <div className="common-button self-center p-1 hover:cursor-pointer">
                    {active[questionIndex] ? (
                      <img
                        className="scale-[1.4]"
                        src={inactiveBookmark}
                        alt="book-marked"
                        onClick={() => handleChangeActive(questionIndex)}
                      ></img>
                    ) : (
                      <img
                        src={activeBookmark}
                        alt="book-mark"
                        onClick={() => handleChangeActive(questionIndex)}
                      ></img>
                    )}
                    <span className="absolute text-hover text-white mt-3 -ml-7 bg-slate-500 p-1 rounded-md">
                      Revisits
                    </span>
                  </div>

                  <button
                    className="common-button p-1"
                    onClick={() => handleReadQuestion(questionIndex)}
                  >
                    {readStatus[questionIndex] ? (
                      <div>
                        <img src={stop} alt="stop"></img>
                        <span className="absolute text-hover text-white mt-3 -ml-4 bg-slate-500 p-1 rounded-md">
                          Stop
                        </span>
                      </div>
                    ) : (
                      <div>
                        <img src={play} alt="play"></img>
                        <span className="absolute text-hover text-white mt-3 -ml-3 bg-slate-500 p-1 rounded-md">
                          Play
                        </span>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              <div className="border border-[#E2E3E8] rounded-lg flex flex-col gap-3 p-5 bg-[#F7F8FB]">
                <p className="text-[#21262C] font-medium text-xl flex gap-3 hyphens-auto">
                  {question.title}
                  {question.isRequired && !selectedAnswers[questionIndex] && (
                    <img src={star} alt="star" className="self-start p-1"></img>
                  )}
                </p>
                {question.questionImage && (
                  <img
                    src={question.questionImage}
                    alt="question-pic"
                    className="mx-auto max-h-40 rounded"
                  />
                )}

                <ul className="flex flex-wrap gap-5 md:gap-x-8 xl:gap-x-16">
                  {question.options &&
                    question.options.map((option, optionIndex) => (
                      <li key={optionIndex}>
                        <label className="flex gap-3">
                          <input
                            className="w-4 xl:w-5 hover:cursor-pointer"
                            type={
                              question.type === "Single Choice"
                                ? "radio"
                                : "checkbox"
                            }
                            name={`question_${questionIndex}`}
                            value={option}
                            checked={
                              question.type === "Single Choice"
                                ? selectedAnswers[questionIndex] === option
                                : selectedAnswers[questionIndex]?.includes(
                                    option
                                  )
                            }
                            onChange={() => {
                              const updatedAnswers = { ...selectedAnswers };
                              if (!updatedAnswers[questionIndex]) {
                                updatedAnswers[questionIndex] = [];
                              }
                              if (question.type === "Single Choice") {
                                updatedAnswers[questionIndex] = option;
                              } else {
                                if (
                                  updatedAnswers[questionIndex].includes(option)
                                ) {
                                  updatedAnswers[questionIndex] =
                                    updatedAnswers[questionIndex].filter(
                                      (item) => item !== option
                                    );
                                } else {
                                  updatedAnswers[questionIndex].push(option);
                                }
                              }
                              setSelectedAnswers(updatedAnswers);
                            }}
                          />
                          <span className="overflow-x-scroll w-48 md:w-[6.6rem] lg:w-[8.5rem] xl:w-[10.1rem] h-7 text-[#586879] lg:text-xl">
                            {option}
                          </span>
                        </label>
                      </li>
                    ))}
                </ul>

                {question.type === "Short Answer" && (
                  <input
                    className="p-3 rounded-md focus:outline-none text-[#586879]  lg:text-lg"
                    type="text"
                    onCopy={(e) => preventCopyPaste(e)}
                    onPaste={(e) => preventCopyPaste(e)}
                    onCut={(e) => preventCopyPaste(e)}
                    value={selectedAnswers[questionIndex] || ""}
                    onChange={(e) =>
                      handleInputChange(questionIndex, e.target.value)
                    }
                  />
                )}
                {question.type === "Paragraph" && (
                  <textarea
                    className="p-3 rounded-md focus:outline-none resize-none text-[#586879]  lg:text-lg"
                    type="text"
                    onCopy={(e) => preventCopyPaste(e)}
                    onPaste={(e) => preventCopyPaste(e)}
                    onCut={(e) => preventCopyPaste(e)}
                    value={selectedAnswers[questionIndex] || ""}
                    rows={3}
                    onChange={(e) =>
                      handleInputChange(questionIndex, e.target.value)
                    }
                  ></textarea>
                )}
                {question.type === "True/False" && (
                  <div className="flex justify-around md:justify-start md:gap-20 text-[#586879]  lg:text-xl">
                    <label className="flex gap-3">
                      <input
                        className="w-4 xl:w-5 hover:cursor-pointer "
                        type="radio"
                        name={`question_${questionIndex}`}
                        value="True"
                        checked={selectedAnswers[questionIndex] === "True"}
                        onChange={() =>
                          handleInputChange(questionIndex, "True")
                        }
                      />
                      True
                    </label>
                    <label className="flex gap-3">
                      <input
                        className="w-4 xl:w-5 hover:cursor-pointer"
                        type="radio"
                        name={`question_${questionIndex}`}
                        value="False"
                        checked={selectedAnswers[questionIndex] === "False"}
                        onChange={() =>
                          handleInputChange(questionIndex, "False")
                        }
                      />
                      False
                    </label>
                  </div>
                )}
              </div>
            </div>
          ))}

        <div className="flex justify-end ">
          <button
            className="text-white bg-[#31A05D] shadow-sm shadow-green-300 rounded-md xl:text-xl p-2.5 md:px-5 font-semibold hover:bg-slate-600 active:bg-slate-500 focus:outline-none focus:ring focus:ring-slate-400"
            onClick={handleNextClick}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPreview;
