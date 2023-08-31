import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import plus from "../svg/plus-solid.svg";
import "./Home.scss";

const Home = ({ handleNext, handleImageClick }) => {
  const savedFormData = JSON.parse(localStorage.getItem("formData")) || [];
  const [loadedData, setLoadedData] = useState(savedFormData);
  const allQuizIds = JSON.parse(localStorage.getItem("allQuizIds")) || [];
  const questionSets = JSON.parse(localStorage.getItem("questionSets")) || [];

  useEffect(() => {
    setLoadedData(savedFormData);
  }, []);

  const handleCreateQuiz = () => {
    const quizId = new Date().getTime();
    localStorage.setItem("quizId", quizId);
    localStorage.setItem("allQuizIds", JSON.stringify([...allQuizIds, quizId]));

    const newSet = { id: quizId, questions: [] };
    localStorage.setItem(
      "questionSets",
      JSON.stringify([...questionSets, newSet])
    );

    handleNext();
  };

  return (
    <div className="mx-2 mt-3 md:p-3 md:mx-24 lg:mx-20 xl:mx-36 xl:p-5 xl:mt-0 overflow-scroll max-h-[90vh]">
      <div className="flex justify-between">
        <h1 className="text-2xl xl:text-3xl font-medium tracking-tighter">
          My Quizzes
        </h1>
        <Router>
          <Link
            className="flex gap-3 self-center p-2 px-3 bg-[#31A05D] text-white rounded-md text-lg md:font-medium lg:font-semibold"
            onClick={() => handleCreateQuiz({})}
          >
            <img className="my-auto" src={plus} alt="add" />
            Create New
          </Link>
        </Router>
      </div>
      <div className="flex flex-wrap gap-6 mt-5 justify-between">
        {loadedData.map((data, index) => (
          <div
            className="flex flex-col gap-2 bg-white rounded-lg mx-auto sm:mx-0"
            key={index}
            onClick={() => handleImageClick(allQuizIds[index])}
          >
            <div className="home-image">
              {data.image && (
                <img
                  className="rounded-t-lg container w-64 h-[14.7rem]"
                  src={data.image}
                  alt="quiz-thumbnail"
                />
              )}
              <div className="description flex flex-col rounded-t-md justify-center items-center p-2 hyphens-auto">
                <span>{data.description}</span>
              </div>
            </div>

            <p className="text-[#414A53] font-semibold text-lg px-5 pt-1">
              {data.title}
            </p>
            <div className="flex gap-2 text-[#898F96] text-sm px-5 pb-5">
              <span>
                {questionSets[index]?.questions?.length || 0} Questions
              </span>
              <hr className="border h-4 self-center border-[#AAADBE]"></hr>
              <span>{data.time} min</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
