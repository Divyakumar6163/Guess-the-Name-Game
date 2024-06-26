import style from "./playingOption.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
export default function PlayingOption({ checkOption }) {
  const [innerContainerClass, setInnerContainerClass] = useState(false);
  const navigate = useNavigate();
  function handleClick1() {
    checkOption(true);
    setInnerContainerClass(true);
    setTimeout(() => {
      navigate("/guess-the-object/choice");
    }, 1700);
  }
  function handleClick2() {
    checkOption(false);
    setInnerContainerClass(true);
    setTimeout(() => {
      navigate("/guess-the-object/choice");
    }, 1700);
  }
  function handleBack() {
    navigate("/guess-the-object");
  }
  return (
    <>
      <Header />
      <div className={style.playingOption}>
        <button className={style.backButton} onClick={handleBack}>
          Back
        </button>
        <div
          className={
            innerContainerClass === true
              ? `${style.innerContainer}`
              : `${style.rotated}`
          }
        >
          <h1 className={style.h1}>Playing Options</h1>
          <button className={style.button} onClick={handleClick1}>
            Single Player
          </button>
          <button className={style.button} onClick={handleClick2}>
            Multi Player
          </button>
        </div>
      </div>
    </>
  );
}
