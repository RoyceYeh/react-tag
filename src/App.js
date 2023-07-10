import axios from "axios";
import { useState, useEffect } from "react";
import styled from "styled-components";
import "./App.css";
import Tag from "./components/Tag";

const Wrap = styled.div`
  width: 95%;
  max-width: 1190px;
  margin: 0px auto;
  margin-top: 50px;
`;
const SelectBox = styled.div`
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.3);
  padding: 15px 20px;
  .hidden {
    display: none;
  }
`;

const SelectRow = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 1rem 0;
  flex-wrap: wrap;
`;
const SelectTitle = styled.p`
  font-family: "Microsoft JhengHei";
  font-size: 16px;
  display: flex;
  width: 7.5%;
  min-width: 66px;
  line-height: 1.5;
  margin-top: 0.5rem;
`;
const SelectCollpase = styled.p`
  cursor: pointer;
  font-family: "Microsoft JhengHei";
  font-size: 18px;
  font-weight: bold;
  display: flex;
  width: 5%;
  line-height: 1.5;
  margin-top: 0.5rem;
  color: #3ea5d9;
`;

const SelectTagBox = styled.div`
  width: calc(100% - 10% - 1.5rem);
  display: flex;
  flex-wrap: wrap;
  height: ${(props) => (props.showHeight ? "40px" : "auto")};
  overflow: ${(props) => (props.showTag ? "hidden" : "unset")};
  .activity {
    border: 1px solid #f03742;
    background-color: #f03742;
    color: #fff;
  }
`;

const SelectTag = styled.div`
  font-size: 16px;
  margin-left: 1rem;
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

function App() {
  //TripTypeList 遊玩交通
  const [tripTypeList, setTripTypeList] = useState([]);

  // 元件、行銷、大交通的TypeList
  //元件、產品規格
  const [componentsTypeLists, setComponentsTypeLists] = useState([]);
  //行銷、行銷活動
  const [marketingTypeLists, setMarketingTypeLists] = useState([]);
  //大交通、
  const [trafficTypeLists, setTrafficTypeLists] = useState([]);

  //產品規格開合
  const [showTag, setShowTag] = useState(true);
  // 大交通
  const [bigTraffic, setBigTraffic] = useState(false);
  const [typeListArr, settypeListArr] = useState([]);

  // api
  useEffect(() => {
    axios
      .get("/json/data.json")
      .then(function (response) {
        const { TripTypeList, CategoryList } = response.data;
        setTripTypeList(TripTypeList);
        // 元件、行銷、大交通
        const [components, marketing, traffic] = CategoryList;

        // 系列、食、宿、郵、購、行
        let { TypeList } = components;
        setComponentsTypeLists(TypeList);
        marketType(marketing);
        trafficType(traffic);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  function marketType(marketing) {
    let { TypeList } = marketing;
    setMarketingTypeLists(TypeList);
  }
  function trafficType(traffic) {
    let { TypeList } = traffic;
    setTrafficTypeLists(TypeList);
  }

  // 收合
  function handleCollpaseBtn() {
    showTag === true ? setShowTag(false) : setShowTag(true);
  }

  function handleTag(event) {
    event.target.classList.toggle("activity");
    let dataCode = event.target.getAttribute("data-code");
    event.target.classList.value.includes("activity") ? setTypeCodeAndBigTraffic(true, dataCode) : removeTypeCodeAndBigTraffic(dataCode);
  }

  function setTypeCodeAndBigTraffic(traffic, typeCode) {
    trafficTypeLists.forEach((typeList) => {
      if (typeList.TripTypeCode === typeCode) {
        setBigTraffic(traffic);
        settypeListArr([typeList, ...typeListArr]);
      }
    });
  }

  function removeTypeCodeAndBigTraffic(typeCode) {
    trafficTypeLists.forEach((typeList) => {
      if (typeList.TripTypeCode === typeCode) {
        settypeListArr(typeListArr.filter((typeList) => typeList.TripTypeCode !== typeCode));
        let checkEmpty = typeListArr.filter((typeList) => typeList.TripTypeCode !== typeCode);
        if (checkEmpty.length === 0) {
          setBigTraffic(false);
        }
      }
    });
  }

  return (
    <Wrap>
      <SelectBox>
        <SelectRow>
          <SelectTitle>遊玩交通</SelectTitle>
          <SelectTagBox>
            {tripTypeList.map((typeList) => {
              return (
                <SelectTag key={typeList.TypeCode} onClick={handleTag} data-code={typeList.TypeCode}>
                  {typeList.TypeName}
                </SelectTag>
              );
            })}
          </SelectTagBox>
        </SelectRow>

        {bigTraffic === true ? (
          <SelectRow className="bigTraffic">
            <SelectTitle>大交通</SelectTitle>
            <SelectTagBox className="selectTagBox">
              {typeListArr.map((typeList) => {
                return <Tag key={typeList.TypeCode} typeList={typeList}></Tag>;
              })}
            </SelectTagBox>
          </SelectRow>
        ) : (
          false
        )}

        <SelectRow>
          <SelectTitle>產品規格</SelectTitle>
          <SelectTagBox showTag={showTag} showHeight={showTag}>
            {componentsTypeLists.map((typeList) => {
              return <Tag key={typeList.TypeCode} typeList={typeList}></Tag>;
            })}
          </SelectTagBox>
          <SelectCollpase onClick={handleCollpaseBtn}>
            {showTag === true && "更多"}
            {showTag === false && "收起"}
          </SelectCollpase>
        </SelectRow>
        <SelectRow>
          <SelectTitle>行銷活動</SelectTitle>
          <SelectTagBox>
            {marketingTypeLists.map((typeList) => {
              return <Tag key={typeList.TypeCode} typeList={typeList}></Tag>;
            })}
          </SelectTagBox>
        </SelectRow>
      </SelectBox>
    </Wrap>
  );
}

export default App;
