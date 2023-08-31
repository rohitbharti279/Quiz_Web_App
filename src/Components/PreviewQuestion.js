import React, { useState } from "react";
import cross from "../svg/xmark-solid.svg";
import star from "../svg/star-solid.svg";
import trash from "../svg/trash-can-regular.svg";

const PreviewQuestion = ({ handlePreviousPage, handleNext }) => {
  const savedFormData = JSON.parse(localStorage.getItem("formData"));
  const quizId = localStorage.getItem("quizId");
  const storedQuestions =
    JSON.parse(localStorage.getItem(`questions_${quizId}`)) || [];
  const questionSets = JSON.parse(localStorage.getItem("questionSets"));
  const presentIndex = savedFormData.length - 1;
  const [questions, setQuestions] = useState(storedQuestions);

  const handleNextClick = () => {
    handleNext();
  };

  const handleBackPage = () => {
    if (window.confirm("Do you wish to add more questions?...")) {
      handlePreviousPage();
    }
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);

    const updatedQuestionSets = questionSets.map((set) => {
      if (set.id === parseInt(quizId)) {
        const updatedSet = { ...set };
        updatedSet.questions = updatedQuestions;
        return updatedSet;
      }
      return set;
    });

    localStorage.setItem("questionSets", JSON.stringify(updatedQuestionSets));
    localStorage.setItem(
      `questions_${quizId}`,
      JSON.stringify(updatedQuestions)
    );
  };

  return (
    <div className="relative overflow-scroll max-h-[100vh]">
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
              onClick={handleBackPage}
            >
              <img src={cross} alt="cross"></img>
              <span className="absolute text-hover text-white font-medium mt-4 mx-5 -ml-8 md:-ml-10 lg:mx- lg:-ml-20 bg-slate-500 p-0.5 md:p-1 rounded-md">
                Add More Questions
              </span>
            </button>
          </div>
        </div>

        {storedQuestions.map((question, index) => (
          <div key={index} className="flex flex-col gap-3">
            <div className="flex justify-between">
              <label className="text-[#85909B] font-medium lg:mt-3">
                {`${(index + 1).toString().padStart(2, "0")} Question`} (
                {question.type})
              </label>
              <button
                className="common-button p-1 lg:self-end"
                onClick={() => handleDeleteQuestion(index)}
              >
                <img className="w-4" src={trash} alt="trash"></img>
                <span className="absolute text-hover text-white mt-3 -ml-10 md:-ml-6 bg-slate-500 p-1 rounded-md">
                  Delete
                </span>
              </button>
            </div>
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
                          className="w-4 xl:w-5 hover:cursor-pointer"
                          type={
                            question.type === "Single Choice"
                              ? "radio"
                              : "checkbox"
                          }
                          name={`question_${index}`}
                          value={option}
                          disabled
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
                  placeholder="Disabled field value.."
                  readOnly
                />
              )}
              {question.type === "Paragraph" && (
                <textarea
                  className="p-3 rounded-md focus:outline-none resize-none text-[#586879]  lg:text-lg"
                  type="text"
                  placeholder="Disabled field value.."
                  rows={3}
                  readOnly
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
                      disabled
                    />
                    True
                  </label>
                  <label className="flex gap-3">
                    <input
                      className="w-4 xl:w-5 hover:cursor-pointer"
                      type="radio"
                      name={`question_${index}`}
                      value="False"
                      disabled
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
            onClick={handleNextClick}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewQuestion;
