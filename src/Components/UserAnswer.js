import React, { useState, useEffect } from "react";
import cross from "../svg/xmark-solid.svg";
import star from "../svg/star-solid.svg";
import congratulation from "../image/congratulation.avif";
import feedbackSound from "../audio/feedback-sound.mp3";

const UserAnswer = ({ selectedQuizId, handleBackToFirstPage }) => {
  const [answers, setUserAnswers] = useState({});
  const [adminAnswers, setAdminAnswers] = useState({});
  const [popup, setPopup] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const [selectedQuestionSet, setSelectedQuestion] = useState(null);
  const [sound, setSound] = useState(new Audio(feedbackSound));
  const questionSets = JSON.parse(localStorage.getItem("questionSets"));
  const foundQuestionSet = questionSets.find(
    (set) => set.id === parseInt(selectedQuizId)
  );

  useEffect(() => {
    setSelectedQuestion(foundQuestionSet);

    const selectedAnswers =
      JSON.parse(localStorage.getItem("selectedAnswers")) || {};
    setUserAnswers(selectedAnswers);

    const selectedAdminAnswers =
      JSON.parse(localStorage.getItem("administratorAnswers")) || [];
    const adminAnswersForQuiz = selectedAdminAnswers.find(
      (set) => set.id === selectedQuizId
    );
    if (adminAnswersForQuiz) {
      setAdminAnswers(adminAnswersForQuiz.answers);
    }
  }, []);

  const handleHomeButton = () => {
    localStorage.removeItem("selectedAnswers");
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
    handleBackToFirstPage();
  }

  return (
    <div className="overflow-scroll max-h-[100vh]">
      <div className="flex flex-col gap-5 bg-white rounded-lg p-2 md:p-4 md:m-8 lg:p-5 lg:m-20 xl:p-6 xl:m-24">
        <div className="flex flex-col md:flex-row justify-between gap-5 border-b pb-5">
          <p className="self-center text-[#414A53] font-semibold text-2xl">
            {foundQuestionSet.title}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <p className="self-center text-[#414A53] font-medium text-xl">
              {foundQuestionSet.questions.length} Questions
            </p>
            <hr className="border h-5  self-center text-[#AAADBE]"></hr>
            <p className="self-center text-red-500 font-medium text-xl">
              {foundQuestionSet.time} min
            </p>
            <button
              className="common-button border-[#D2DAE7] border-2 rounded-md p-1 hover:bg-slate-300"
              onClick={handleHomeButton}
            >
              <img src={cross} alt="cross"></img>
              <span className="absolute text-hover text-white font-medium mt-4 -ml-6 md:-ml-12 bg-slate-500 p-1 rounded-md">
                Back To Home
              </span>
            </button>
          </div>
        </div>

        {selectedQuestionSet &&
          selectedQuestionSet.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="flex flex-col gap-3 ">
              <p className="text-[#85909B] font-medium lg:mt-3">
                {`${(questionIndex + 1).toString().padStart(2, "0")} Question`}{" "}
                ({question.type})
              </p>

              <div className="border border-[#E2E3E8] rounded-lg flex flex-col gap-3 p-5 bg-[#F7F8FB]">
                <p className="text-[#21262C] font-medium text-xl flex gap-3 hyphens-auto">
                  {question.title}
                  {question.isRequired && (
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
                            className="w-5 hover:cursor-pointer"
                            type={
                              question.type === "Single Choice"
                                ? "radio"
                                : "checkbox"
                            }
                            name={`question_${questionIndex}`}
                            value={option}
                            checked={
                              question.type === "Single Choice"
                                ? answers[questionIndex] === option
                                : answers[questionIndex]?.includes(option)
                            }
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
                    value={answers[questionIndex] || ""}
                    readOnly
                  />
                )}
                {question.type === "Paragraph" && (
                  <textarea
                    className="p-3 rounded-md focus:outline-none resize-none text-[#586879]  lg:text-lg"
                    value={answers[questionIndex] || ""}
                    rows={3}
                    readOnly
                  ></textarea>
                )}
                {question.type === "True/False" && (
                  <div className="flex justify-around md:justify-start md:gap-20 text-[#586879]  lg:text-xl">
                    <label className="flex gap-3">
                      <input
                        className="w-4 xl:w-5 hover:cursor-pointer"
                        type="radio"
                        name={`question_${questionIndex}`}
                        value="True"
                        checked={answers[questionIndex] === "True"}
                      />
                      True
                    </label>
                    <label className="flex gap-3">
                      <input
                        className="w-4 xl:w-5 hover:cursor-pointer"
                        type="radio"
                        name={`question_${questionIndex}`}
                        value="False"
                        checked={answers[questionIndex] === "False"}
                      />
                      False
                    </label>
                  </div>
                )}
                <div className="flex justify-end max-h-[5.5rem] ">
                  <p className="overflow-x-scroll lg:text-xl  text-green-700 border rounded-md bg-white div-1 px-2 whitespace-pre-line ">
                    <span className="text-[#586879]">Answer: </span>
                    {`${adminAnswers[questionIndex]}`}
                    {"\n"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        <div className="flex justify-end">
          <button
            className="text-white bg-[#31A05D] rounded-md xl:text-xl p-2.5 md:px-5 font-semibold"
            onClick={handleHomeButton}
          >
            Home
          </button>
        </div>
      </div>
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
      {popup && (
        <div className="flex flex-col justify-center items-center fixed bg-[#000000b3] top-0 w-[100vw] h-[100vh]">
          <div className="bg-white rounded-md font-serif py-8 md:p-2 md:w-[26rem] md:h-[22rem] lg:w-[32rem] xl:w-[35rem] xl:h-[25rem] xl:p-4 flex flex-col justify-center items-center">
            <img
              src={congratulation}
              alt="congratulations"
              className="w-[5rem] md:w-[10rem] bg-blend-multiply filter-none"
            ></img>
            <p className="text-xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
              Congratulations!
            </p>
            <p className="lg:text-lg xl:text-xl text-[#85909B] text-center lg:mt-5">
              Thank you for Participating, Testing your Knowledge and Taking an
              important step towards learning!
            </p>
            <p className="md:mt-2 text-green-600 text-lg lg:text-xl text-center">
              You've completed the quiz!!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAnswer;
