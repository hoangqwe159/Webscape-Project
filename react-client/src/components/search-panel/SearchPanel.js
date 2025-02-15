import React, { useState, useEffect, useRef } from "react";
import { Input, Button, Tree, Row, Col } from "antd";
const { Search } = Input;

export default function SearchPanel(props) {
  const {
    packedData,
    selectSample,
    deleteSample,
    restoreSample,
    restorePoint,
    selectAntibiotic,
  } = props;
  const [data, setData] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [restoreData, setRestoreData] = useState([]);

  useEffect(() => {
    var dataTemp = [];
    var dataListTemp = [];
    var restoreDataTemp = [];
    if (packedData !== null) {
      for (let i = 0; i < packedData.length; i++) {
        if (packedData[i].name !== null) {
          dataTemp.push({
            title: packedData[i].name,
            key: packedData[i].name,
            children: [],
          });

          dataListTemp.push({
            title: packedData[i].name,
            key: packedData[i].name,
          });
          for (let j = 0; j < packedData[i].children.length; j++) {
            dataTemp[dataTemp.length - 1].children.push({
              title: packedData[i].children[j].name.replace(".csv", ""),
              key: packedData[i].name.concat(
                packedData[i].children[j].name.replace(".csv", "")
              ),
              value: packedData[i].children[j].value,
            });

            dataListTemp.push({
              title: packedData[i].children[j].name.replace(".csv", ""),
              key: packedData[i].name.concat(
                packedData[i].children[j].name.replace(".csv", "")
              ),
            });
          }
        }
      }

      for (let i = 0; i < restorePoint.length; i++) {
        if (restorePoint[i].name !== null) {
          restoreDataTemp.push({
            title: restorePoint[i].name,
            key: restorePoint[i].name,
            children: [],
          });

          for (let j = 0; j < restorePoint[i].children.length; j++) {
            restoreDataTemp[restoreDataTemp.length - 1].children.push({
              title: restorePoint[i].children[j].name.replace(".csv", ""),
              key: restorePoint[i].name.concat(
                restorePoint[i].children[j].name.replace(".csv", "")
              ),
              value: restorePoint[i].children[j].value,
            });
          }
        }
      }
    }
    setDataList(dataListTemp);
    setData(dataTemp);
    setRestoreData(restoreDataTemp);
  }, [packedData, restorePoint]);

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [searchValue, setSearchValue] = useState([]);

  const timer = useRef(null);

  const onKeyUp = (e) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => triggerSearch(e), 500);
  };

  const onKeyDown = (e) => {
    clearTimeout(timer);
  };

  const triggerSearch = (e) => {
    const { value } = e.target;
    if (value !== "") {
      const expandedKeys = dataList
        .map((item) => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, data);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);

      const checkedKeys = dataList
        .map((item) => {
          if (item.key.indexOf(value) > -1) {
            return item.key;
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);

      setExpandedKeys(expandedKeys);
      setCheckedKeys(checkedKeys);
      setSearchValue(value);
      setAutoExpandParent(true);
    } else {
      setExpandedKeys([]);
      setCheckedKeys([]);
      setSearchValue(value);
      setAutoExpandParent(true);
    }
  };

  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const onExpand = (expandedKeysValue) => {
    //console.log ('onExpand', expandedKeysValue); // if not set autoExpandParent to false, if children expanded, parent can not collapse.

    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue) => {
    //console.log ('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue, info) => {
    if (selectedKeysValue.length > 0) {
      console.log("onSelect", selectedKeysValue);
      setSelectedKeys(selectedKeysValue);
      var matches = selectedKeysValue[0].match(/(\d+)/);
      if (matches) {
        selectSample(matches[0]);
        let splitString = selectedKeysValue[0].split(/([0-9]+)/);
        selectAntibiotic(splitString[0]);
      } else {
        selectAntibiotic(selectedKeysValue[0]);
      }
    }
  };

  const handleDeleteSelected = (value) => {
    let sampleToDelete = checkedKeys;
    let dataTemp = [...data];
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== undefined) {
        var filtered = data[i].children.filter(function (item) {
          return sampleToDelete.indexOf(item.key) <= -1;
        });
        dataTemp[i].children = filtered;
      }
    }

    let newPackedData = formatData(dataTemp);
    deleteSample(newPackedData);
    setData(dataTemp);
    //console.log (restoreData);
  };

  const formatData = (dataTemp) => {
    let newPackedData = [];
    for (let i = 0; i < dataTemp.length; i++) {
      newPackedData.push({
        name: dataTemp[i].title,
        children: [],
      });
      for (let j = 0; j < dataTemp[i].children.length; j++) {
        newPackedData[newPackedData.length - 1].children.push({
          name: dataTemp[i].children[j].title,
          value: dataTemp[i].children[j].value,
        });
      }
    }
    return newPackedData;
  };

  const handleRestore = (value) => {
    let dataTemp2 = JSON.parse(JSON.stringify(restoreData));
    let newPackedData = formatData(dataTemp2);
    restoreSample(newPackedData);
    setData(dataTemp2);
  };

  const loop = (data) =>
    data.map((item) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children) {
        return { title, key: item.key, children: loop(item.children) };
      }

      return {
        title,
        key: item.key,
      };
    });
  return (
    <div>
      <Search
        style={{ marginBottom: 8 }}
        placeholder="Search"
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      />
      <Tree
        checkable
        style={{ overflow: "auto", height: "40vh", marginBottom: "20px" }}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={loop(data)}
      />
      <Row align="center">
        <Col>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleRestore();
            }}
            style={{ marginRight: 30 }}
            type="primary"
          >
            Restore
          </Button>
        </Col>
        <Col>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSelected();
            }}
            type="primary"
          >
            Delete
          </Button>
        </Col>
      </Row>
    </div>
  );
}
