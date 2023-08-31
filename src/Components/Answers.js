import React, { useState } from "react";
import cross from "../svg/xmark-solid.svg";
import star from "../svg/star-solid.svg";
import flower from "../image/flower.png";
import feedbackSound from "../audio/feedback-sound.mp3";

const Answers = ({ handleBackToFirstPage }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [popup, setPopup] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const [sound, setSound] = useState(new Audio(feedbackSound));
  const savedFormData = JSON.parse(localStorage.getItem("formData"));
  const quizId = JSON.parse(localStorage.getItem("quizId"));
  const storedQuestions =
    JSON.parse(localStorage.getItem(`questions_${quizId}`)) || [];
  const presentIndex = savedFormData.length - 1;
  
  const handleHomePage = () => {
    const unansweredRequiredQuestions = storedQuestions.filter(
      (question, index) => question.isRequired && !selectedAnswers[index]
    );

    if (unansweredRequiredQuestions.length > 0) {
      alert("Please answer all required questions before submitting.");
      return;
    }

    const administratorAnswers =
      JSON.parse(localStorage.getItem("administratorAnswers")) || [];
    const quizAnswers = { id: quizId, answers: selectedAnswers }; // Store the answers in an object
    localStorage.setItem(
      "administratorAnswers",
      JSON.stringify([...administratorAnswers, quizAnswers])
    );

    sound.play();
    setPopup(true);
    setTimeout(() => {
      setPopup(false);
      setFeedback(true);
    }, 5000);
  };

  function submitFeedback() {
    sound.pause();
    sound.currentTime = 0;
    setFeedback(false);
    localStorage.removeItem(`questions_${quizId}`);
    handleBackToFirstPage();
  }

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

  return (
    <div className="overflow-scroll max-h-[100vh]">
      <div className="flex flex-col gap-5 bg-white rounded-lg p-2 md:p-4 md:m-8 lg:p-5 lg:m-20 xl:p-6 xl:m-24">
        <div className="flex flex-col md:flex-row justify-between gap-5 border-b pb-5">
          <p className="self-center text-[#414A53] font-semibold text-2xl xl:text-3xl">
            {savedFormData[presentIndex].title}
          </p>
          <div className="flex flex-wrap gap-4 md:gap-5 justify-center">
            <p className="self-center text-[#414A53] font-medium text-xl xl:text-[21px]">
              {storedQuestions.length} Questions
            </p>
            <hr className="border h-5  self-center text-[#AAADBE]"></hr>
            <p className="self-center text-[#414A53] font-medium text-xl xl:text-[21px]">
              {savedFormData[presentIndex].time} min
            </p>
            <button
              className="common-button border-[#D2DAE7] border-2 rounded-md p-1 lg:ms-7 hover:bg-slate-300"
              onClick={handleClearForm}
            >
              <img src={cross} alt="cross"></img>
              <span className="absolute text-hover text-white font-medium mt-4 -ml-6 mx-2 lg:-mx-16 bg-slate-500 p-1 rounded-md">
                Delete All Answers
              </span>
            </button>
          </div>
        </div>

        {storedQuestions.map((question, index) => (
          <div key={index} className="flex flex-col gap-3">
            <label className="text-[#85909B] font-medium lg:mt-3">
              {`${(index + 1).toString().padStart(2, "0")} Question`} (
              {question.type})
            </label>
            <div className="border border-[#E2E3E8] rounded-lg flex flex-col gap-3 p-5 bg-[#F7F8FB]">
              <p className="text-[#21262C] font-medium text-xl flex gap-3 hyphens-auto">
                {question.title}
                {question.isRequired && !selectedAnswers[index] && (
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
                          name={`question_${index}`}
                          value={option}
                          checked={
                            question.type === "Single Choice"
                              ? selectedAnswers[index] === option
                              : selectedAnswers[index]?.includes(option)
                          }
                          onChange={() => {
                            const updatedAnswers = { ...selectedAnswers };
                            if (!updatedAnswers[index]) {
                              updatedAnswers[index] = [];
                            }
                            if (question.type === "Single Choice") {
                              updatedAnswers[index] = option;
                            } else {
                              if (updatedAnswers[index].includes(option)) {
                                updatedAnswers[index] = updatedAnswers[
                                  index
                                ].filter((item) => item !== option);
                              } else {
                                updatedAnswers[index].push(option);
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
                  className="p-3 rounded-md focus:outline-none text-[#586879] lg:text-lg placeholder:italic"
                  type="text"
                  placeholder="Enter answer here..."
                  value={selectedAnswers[index] || ""}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              )}
              {question.type === "Paragraph" && (
                <textarea
                  className="p-3 rounded-md focus:outline-none resize-none text-[#586879] lg:text-lg placeholder:italic"
                  type="text"
                  placeholder="Enter answer here..."
                  value={selectedAnswers[index] || ""}
                  rows={3}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                ></textarea>
              )}
              {question.type === "True/False" && (
                <div className="flex justify-around md:justify-start md:gap-20 text-[#586879]  lg:text-xl">
                  <label className="flex gap-3">
                    <input
                      className="w-4 xl:w-5 hover:cursor-pointer "
                      type="radio"
                      name={`question_${index}`}
                      value="True"
                      checked={selectedAnswers[index] === "True"}
                      onChange={() => handleInputChange(index, "True")}
                    />
                    True
                  </label>
                  <label className="flex gap-3">
                    <input
                      className="w-4 xl:w-5 hover:cursor-pointer"
                      type="radio"
                      name={`question_${index}`}
                      value="False"
                      checked={selectedAnswers[index] === "False"}
                      onChange={() => handleInputChange(index, "False")}
                    />
                    False
                  </label>
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="flex justify-end">
          <button
            className="text-white bg-[#31A05D] rounded-md xl:text-xl p-2.5 md:px-5 font-semibold"
            onClick={handleHomePage}
          >
            Home
          </button>
        </div>
      </div>

      {popup && (
        <div className="flex flex-col justify-center items-center fixed bg-[#000000b3] top-0 w-[100vw] h-[100vh]">
          <div className="bg-white rounded-md font-serif p-1 py-8 md:p-2 md:w-[25rem] md:h-[20rem] lg:w-[30rem] xl:w-[35rem] xl:h-[25rem] xl:p-4 flex flex-col justify-center items-center">
            <img
              src={flower}
              alt="flowers"
              className="w-[3rem] md:w-[5rem]"
            ></img>
            <p className="text-2xl md:text-3xl lg:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Congratulations!
            </p>
            <p className="lg:text-lg xl:text-xl text-[#85909B] text-center">
              Your questions and answers have been seamlessly integrated in to
              the quiz.
            </p>
            <p className="md:mt-2 text-green-600 text-lg lg:text-xl text-center">
              Keep Shining and Keep Sharing Knowledge!
            </p>
          </div>
        </div>
      )}

      {feedback && (
        <div className="flex justify-center items-center fixed bg-[#000000b3] top-0 w-[100vw] h-[100vh]">
          <div className="bg-white rounded-md font-serif p-1 py-8 md:p-2 w-[20rem] md:w-[25rem] md:h-[20rem] lg:w-[30rem] lg:p-6 xl:w-[37rem] xl:h-[25rem] flex flex-col gap-3 justify-center items-center">
            <h2 className="text-xl md:text-2xl xl:text-3xl text-[#589c36] text-center">
              What is your level of satisfaction with this quiz app?
            </h2>
            <p className="text-[#85909B] xl:text-xl text-center">
              This will help us improve your experience.
            </p>
            <label className="flex gap-10 text-6xl text-[#85909B]">
              <button onClick={submitFeedback}>
                &#128545;<br></br>
                <span className="text-lg md:text-xl xl:text-2xl text-red-600">
                  Unhappy
                </span>
              </button>
              <button onClick={submitFeedback}>
                &#128528;<br></br>
                <span className="text-lg md:text-xl xl:text-2xl text-yellow-500">
                  Neutral
                </span>
              </button>
              <button onClick={submitFeedback}>
                &#128525;<br></br>
                <span className="text-lg md:text-xl xl:text-2xl text-green-600">
                  Satisfied
                </span>
              </button>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default Answers;
