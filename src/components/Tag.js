import { useState, useEffect } from "react";
import styled from "styled-components";

const SelectTag = styled.div`
  font-size: 16px;
  margin-left: 0.5rem;
  margin-top: 0.5rem;
  cursor: pointer;
  padding: 0.1rem 1rem 0.05rem 1rem;
  border: 1px solid #000;
  border-radius: 2.5rem;
  line-height: 1.5;
  background-color: ${(props) => (props.activity ? "#f03742" : "transparent")};
  &:hover {
    background-color: #f03742;
    color: #fff;
  }
`;

export default function Tag({ typeList }) {
  const [alldata, setAllData] = useState([]);

  useEffect(() => {
    const { GroupList } = typeList;
    handleGroupList(GroupList);
  }, [typeList]);

  function handleGroupList(GroupList) {
    let tagsArray = [];
    GroupList.forEach((res) => {
      res.TagList.forEach((res) => {
        return tagsArray.push(res);
      });
    });

    setAllData(tagsArray);
  }

  function handlebtnactivity(e) {
    e.target.classList.toggle("activity");
  }

  return (
    <>
      {alldata.map((a) => {
        return (
          <SelectTag key={a.TagNo} onClick={handlebtnactivity}>
            {a.TagName}
          </SelectTag>
        );
      })}
    </>
  );
}
