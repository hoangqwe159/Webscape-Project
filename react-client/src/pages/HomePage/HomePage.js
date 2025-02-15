import React from "react";
import "./HomePage.css";
import { Panel } from "rsuite";
import { Container, Row, Col } from "react-bootstrap";
import BubbleGraph from "../../image/BubbleGraph.png";
import CircleGraph from "../../image/CircleGraph.png";
import NodeNetwork from "../../image/NodeNetwork.png";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { AmrPdfDefinition } from "../../pdf/DocDefinition";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function HomePage() {
  let numbers = [10, 6, 2, 3, 7, 1, 2];
  let array = [];
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    let numberToInsert = numbers[i];
    let index = sortedIndex(array, numberToInsert);
    array.splice(index, 0, numberToInsert);

    if (index >= array.length / 2) {
      sum = sum + (array.length - 1 - index + 2);
    } else {
      sum = sum + (index + index + 1);
    }
  }

  function savePdf() {
    const doc = AmrPdfDefinition({});
    console.log(doc);
    pdfMake.createPdf(doc).open();
  }

  function sortedIndex(array, value) {
    var low = 0,
      high = array.length;

    while (low < high) {
      var mid = (low + high) >>> 1;
      if (array[mid] < value) low = mid + 1;
      else high = mid;
    }
    return low;
  }

  return (
    <Container>
      {/* <button onClick={savePdf}>save</button> */}
      <Panel className="pn">
        <Panel className="pn-header">
          <h1>Staphbook</h1>
          <p>
            This is a website dedicated for data visualizing baterial pathogen -
            Staphyloccocus Aureus
          </p>
          <p>
            We provide tools for scienctists, clinicians and community that
            wants to reasearch Antimicrobial Resistance in Staphyloccocus Aureus
          </p>
        </Panel>
        <Panel className="pn-content">
          <h2>The Tools</h2>
          <Row md={12} className="row-card">
            <Col md={4}>
              <Panel className="card">
                <img src={BubbleGraph} alt="bubble graph" />
                <h2>AMR Bubble Graph</h2>
                <p>
                  The dark green circles indicate the antibiotic medicine. The
                  size will depend on how many samples resistance to that
                  antibiotic. We can also use color to indicate this ass well.
                  The small white circles are sample that contains contigs
                  resistance to that antibiotic. Currently we only show the
                  sample id in circle. Is there any other information about the
                  sample you would like us to show? The size of the white sample
                  circle is decided by how many contigs in the sample resistance
                  to the antibiotic.
                </p>
              </Panel>
            </Col>
            <Col md={4}>
              <Panel className="card">
                <img src={CircleGraph} alt="circle graph" />
                <h2>AMR Circle Graph</h2>
                <p>
                  This graph provides information of certain sequences resistant
                  to specific antibiotics in one sample in Staphopia API. The
                  arrows indicate that the sequences relate to each other and
                  they are in the same assembled contig.
                </p>
              </Panel>
            </Col>
            <Col md={4}>
              <Panel className="card">
                <img src={NodeNetwork} alt="node network" />
                <h2>AMR Node Network</h2>
                <p>
                  The nodes would represent the samples and the edges connect
                  two nodes when the nodes have the same antibiotic resistance.
                  The weight of the edges could be calculated by the number of
                  the same antibiotics found between the two nodes. The users
                  can interact with the graphs, highlight the node and its
                  relationship to view the graph clearly
                </p>
              </Panel>
            </Col>
          </Row>
        </Panel>
      </Panel>

      {/* <Row className="justify-content-md-center">
        <Col xs lg="2">
          <img src={QUTLogo} alt="QUT" className="img_logo" />
        </Col>
        <Col xs lg="2">
          <img src={EmoryLogo} alt="Emory" className="img_logo" />
        </Col>
      </Row> */}
    </Container>
  );
}
