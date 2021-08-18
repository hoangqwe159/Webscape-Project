import React, {useState, useEffect} from 'react';
import {Row, Col, Card, Menu, Input, List, Button, Empty} from 'antd';
// import { Row, Col } from "react-bootstrap";
import BubbleChart from '../../components/bubble-chart';
import SearchPanel from '../../components/search-panel';
import SampleInfoPanel from '../../components/sample-info-panel';
// import data from "../../TestingData/data2";
import './AMRPage.css';
import {useSelector, useDispatch} from 'react-redux';
import {fetchPackedCircleData, fetchSelectedSample} from '../../api/AMRapi';
import {
  dispatchDeleteSample,
  dispatchPackedCircleData,
  dispatchRestoreSample,
  dispatchPackedCircleRestoreData,
  selectSample,
} from '../../redux/actions/visualization';
import AmrTable from '../../components/amr-table';
import AmrStatisticPanel from '../../components/AmrStatisticPanel';

export default function AMRPage () {
  const [isLoadingSelect, setIsLoadingSelect] = useState (false);
  const [isLoadingPacked, setIsLoadingPacked] = useState (false);
  const SampleInfoData = useSelector (state => state.Visualization.sampleInfo);
  const AMRTableData = useSelector (state => state.Visualization.amrTable);
  const [AMRStatisticData, setAMRStatisticData] = useState (null);
  const SampleSelectData = useSelector (
    state => state.Visualization.sampleSelection
  );
  const PackedCircleData = useSelector (
    state => state.Visualization.packedCircleData
  );

  const PackedCircleRestoreData = useSelector (
    state => state.Visualization.packedCircleRestoreData
  );
  const dispatch = useDispatch ();

  useEffect (() => {
    async function getPackedData () {
      setIsLoadingPacked (true);
      const result = await fetchPackedCircleData ();
      dispatch (dispatchPackedCircleData (result));
      dispatch (dispatchPackedCircleRestoreData (result));
      setIsLoadingPacked (false);
    }
    getPackedData ();
  }, []);

  const handleSelectSample = async sample => {
    setIsLoadingSelect (true);
    const data = await fetchSelectedSample (sample);
    dispatch (selectSample (data));
    setIsLoadingSelect (false);
  };

  const handleDeleteSample = samples => {
    dispatch (dispatchDeleteSample (samples));
  };

  const handleRestoreSample = samples => {
    dispatch (dispatchRestoreSample (samples));
  };

  return (
    <Row gutter={[8, 8]} type="flex">
      <Col span={5}>
        <Card title="Search Sample" style={{height: '100vh'}}>
          {PackedCircleData !== null && PackedCircleRestoreData !== null
            ? <SearchPanel
                packedData={PackedCircleData}
                restorePoint={PackedCircleRestoreData}
                selectSample={handleSelectSample}
                deleteSample={handleDeleteSample}
                restoreSample={handleRestoreSample}
              />
            : <div />}
        </Card>

      </Col>
      <Col span={19}>
        <Row gutter={[8, 8]} type="flex">
          <Col span={19}>
            <Card title="AMR Visualizations" style={{height: '60vh'}}>
              <BubbleChart
                width="500"
                height="500"
                data={PackedCircleData}
                isLoading={isLoadingPacked}
                selectSample={handleSelectSample}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card title="Sample Information" style={{height: '30vh'}}>
              {SampleInfoData !== null
                ? <SampleInfoPanel
                    sampleMetadata={SampleInfoData}
                    isLoading={isLoadingSelect}
                  />
                : <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span>Please select sample</span>}
                  />}
            </Card>
            <Card title="AMR Statistic" style={{height: '30vh'}}>
              {AMRStatisticData !== null
                ? <AmrStatisticPanel />
                : <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<span>Please select sample</span>}
                  />}
            </Card>
          </Col>
        </Row>
        <Row gutter={[8, 8]} type="flex">
          <Col key="AMR-Table" span={24}>
            <Card title="AMR Table" style={{height: '40vh'}}>
              <AmrTable data={AMRTableData} />
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
