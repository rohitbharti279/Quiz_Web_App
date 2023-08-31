import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./AddQuestion.scss";
import arrow from "../svg/angle-right-solid.svg";
import preview from "../svg/eye-regular.svg";
import plus from "../svg/plus-solid.svg";
import cross from "../svg/xmark-solid.svg";
import trash from "../svg/trash-can-regular.svg";
import addImage from "../image/add-image.png";

const AddQuestion = ({ handleNext }) => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [options, setOptions] = useState([]);
  const [optionText, setOptionText] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [showOption, setShowOption] = useState(true);
  const [popupQuestion, setPopupQuestion] = useState(false);
  const [questionImage, setQuestionImage] = useState(null);

  const optionTextTrim = optionText.trim();
  const quizId = localStorage.getItem("quizId");
  const storedQuestions =
    JSON.parse(localStorage.getItem(`questions_${quizId}`)) || [];

  const questionSets = JSON.parse(localStorage.getItem("questionSets"));
  const currentQuestionSet = questionSets.find(
    (set) => set.id === parseInt(quizId)
  );
  const ref = useRef();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setQuestionImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleAddOption = () => {
    if (isOptionExist) {
      alert("Option already exists... 😞 ");
    } else if (optionTextTrim !== "") {
      setOptions([...options, optionText]);
      setOptionText("");
      setShowOption(!showOption);
    }
  };

  const isOptionExist = options.find(
    (record) => record.toLowerCase() === optionTextTrim.toLowerCase()
  );

  const isQuestionExist = storedQuestions.find(
    (quest) =>
      quest.title.replace(/ /g, "").toLowerCase() ===
      questionTitle.trim().replace(/ /g, "").toLowerCase()
  );

  const handleAddQuestion = () => {
    if (isQuestionExist) {
      alert("Question already exists...😔");
    } else if (
      questionTitle.trim() !== "" &&
      questionType !== "" &&
      (questionType === "Single Choice" || questionType === "Multiple Choice"
        ? options.length > 1 //atleast two options
        : options.length === 0)
    ) {
      const newQuestion = {
        title: questionTitle,
        type: questionType,
        options:
          questionType === "Single Choice" || questionType === "Multiple Choice"
            ? options
            : null,
        isRequired,
        questionImage,
      };

      const updatedQuestionSet = {
        ...currentQuestionSet,
        questions: [...currentQuestionSet.questions, newQuestion],
      };

      const updatedSets = questionSets.map((set) =>
        set.id === parseInt(quizId) ? updatedQuestionSet : set
      );
      localStorage.setItem("questionSets", JSON.stringify(updatedSets));

      const updatedQuestions = [...storedQuestions, newQuestion];

      setQuestionType("");
      setOptions([]);
      setIsRequired(false);
      setQuestionImage("");
      ref.current.value = "";

      setPopupQuestion(true);
      setTimeout(() => {
        setPopupQuestion(false);
      }, 1900);

      localStorage.setItem(
        `questions_${quizId}`,
        JSON.stringify(updatedQuestions)
      );
    } else
      alert(
        "Ensure the question title is valid, choose a question type, and include a minimum of two options for single or multiple-choice questions... 😒"
      );
  };

  const addAnotherQuestion = () => {
    setQuestionTitle("");
    setQuestionType("");
    setOptions([]);
    setIsRequired(false);
    setShowOption(true);
    setQuestionImage("");
    ref.current.value = "";
  };

  const handlePreviewClick = () => {
    handleNext();
  };

  const handleClearForm = () => {
    if (window.confirm("Are you sure you want to delete the question ? 😲")) {
      setQuestionTitle("");
      setQuestionType("");
      setOptions([]);
      setOptionText("");
      setIsRequired(false);
      setQuestionImage("");
      ref.current.value = "";
    }
  };

  return (
    <div className="relative overflow-scroll max-h-[100vh]">
      <div className="flex flex-col gap-5 bg-[#FFFFFF] rounded-md p-2 md:m-5 md:p-5 lg:mt-8 lg:p-6 lg:mx-20 xl:mt-24 xl:mx-40">
        <div className="flex gap-5 md:gap-8 lg:gap-12 border-b pb-5">
          <p className="flex gap-3 items-center text-[#414A53] text-lg xl:text-2xl">
            <span className="bg-[#31A05D] text-white p-1 px-3.5 rounded-full font-bold">
              1
            </span>
            Create a Quiz
          </p>
          <img src={arrow} alt="arrow"></img>
          <p className="flex gap-3 items-center text-[#414A53] text-lg xl:text-2xl">
            <span className="bg-[#31A05D] text-white  p-1 px-3 rounded-full font-bold">
              2
            </span>
            Add Question
          </p>
        </div>
        <div className="flex flex-col">
          <p className="flex justify-between py-1">
            <label
              htmlFor="title"
              className="text-[#85909B] text-lg xl:text-2xl"
            >
              Question Title
            </label>
            <span className="common-button flex p-">
              <img className="w-8 absolute" src={addImage} alt="add-pic"></img>
              <input
                ref={ref}
                className=" w-10 opacity-0 "
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <span className="absolute text-hover text-white mt-10 -ml-12 md:-ml-8 bg-slate-500 p-1 rounded-md">
                Add Image
              </span>
            </span>
          </p>

          <input
            type="text"
            className="mt-1 focus:outline-none border border-[#E2E3E8] rounded-lg p-3 bg-[#F7F8FB] xl:text-2xl text-[#21262C] xl:px-6 placeholder:italic"
            placeholder="Write question here.."
            value={questionTitle}
            onChange={(e) => setQuestionTitle(e.target.value)}
          ></input>
          <br></br>

          <label htmlFor="title" className="text-[#85909B] text-lg xl:text-2xl">
            Question Type
          </label>
          <select
            className="select-option mt-1 focus:outline-none border border-[#E2E3E8] rounded-lg p-3  xl:text-2xl text-[#21262C] xl:px-6"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="">Select Question Type</option>
            <option value="Short Answer">Short Answer</option>
            <option value="Paragraph">Paragraph</option>
            <option value="True/False">True / False</option>
            <option value="Single Choice">Single Choice</option>
            <option value="Multiple Choice">Multiple Choice</option>
          </select>
        </div>

        {(questionType === "Single Choice" ||
          questionType === "Multiple Choice") && (
          <div className="flex flex-col gap-5 ">
            <ul className="flex flex-wrap gap-5 md:gap-x-2 lg:gap-x-6 xl:gap-x-8">
              {options.map((option, index) => (
                <li
                  key={index}
                  className="flex border border-[#E2E3E8] gap-3 rounded-md text-xl text-[#586879] p-2 px-4"
                >
                  {questionType === "Single Choice" ? (
                    <input
                      className="w-4 xl:w-5"
                      type="radio"
                      name="selectedOption"
                      value={option}
                    />
                  ) : (
                    <input
                      className="w-4 xl:w-5"
                      type="checkbox"
                      value={option}
                    />
                  )}
                  <p className="overflow-x-scroll w-[10rem] md:w-[7rem] lg:w-[8.1rem] xl:w-[10.1rem] h-7 text-[#586879]">
                    {option}
                  </p>
                  <button
                    className="ps-12 md:ps-4 lg:ps-8 xl:ps-20"
                    onClick={() => {
                      const updatedOptions = [...options];
                      updatedOptions.splice(index, 1);
                      setOptions(updatedOptions);
                    }}
                  >
                    <img className="w-4" src={cross} alt="cross"></img>
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="flex underline underline-offset-4 text-[#31A05D] text-lg"
              onClick={() => setShowOption(!showOption)}
            >
              Add another option
            </button>
            {showOption && (
              <div>
                <label className="text-[#85909B]">Option Title</label>
                <br></br>
                <input
                  className="p-2 mt-2 px-6 w-56 md:w-64 border rounded-md bg-[#F7F8FB] focus:outline-none text-[#21262C] text-lg placeholder:italic"
                  type="text"
                  placeholder="Add Option.."
                  value={optionText}
                  onChange={(e) => setOptionText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddOption();
                    }
                  }}
                />
                <button
                  className="bg-[#31A05D] text-white p-2.5 xl:p-3 px-3 rounded-md ms-3"
                  onClick={handleAddOption}
                >
                  Add
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 md:flex-row md:justify-between">
          <div className="flex gap-4 self-center">
            <p className="text-[#85909B] font-medium self-center">Required</p>
            <input
              type="checkbox"
              id="toggle"
              className="check-box"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
            />
            <label htmlFor="toggle" className="switch"></label>
          </div>
          <div className="flex gap-10 self-center">
            <button className="common-button" onClick={handleClearForm}>
              <img src={trash} alt="trash"></img>
              <span className="absolute text-hover text-white mt-3 -ml-14 bg-slate-500 p-1 rounded-md">
                Delete Qustion
              </span>
            </button>
            <button
              className="text-white bg-[#31A05D] rounded-md xl:text-xl p-3 md:px-5 font-semibold text-center"
              onClick={handleAddQuestion}
            >
              Save Question
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#FFFFFF] rounded-md mt-5 md:m-5 lg:mx-20 xl:mx-40">
        <button
          className="flex gap-3 items-center text-lg xl:text-2xl text-[#414A53] p-3  md:px-5 lg:px-6"
          onClick={addAnotherQuestion}
        >
          <img
            className="bg-[#31A05D] text-white p-2 px-2.5 md:p-2.5 md:px-3 rounded-full font-bold"
            src={plus}
            alt="plus"
          ></img>
          Add another question
        </button>
      </div>

      <div className="flex mt-5 md:m-5 lg:mx-20 xl:mx-40 justify-end">
        <Router>
          <Link
            className="preview text-[#21262C] flex gap-3 bg-[#DBE3ED] rounded xl:text-xl p-3 px-4"
            onClick={handlePreviewClick}
          >
            <img src={preview} alt="preview" className="self-center"></img>
            Preview
          </Link>
        </Router>
      </div>
      {popupQuestion && (
        <div className="flex justify-center items-center fixed top-0 w-[100vw] h-[100vh]">
          <div className="text-green-900 animate-ping lg:text-2xl">
            Question Saved! 😊
          </div>
        </div>
      )}
    </div>
  );
};

export default AddQuestion;
