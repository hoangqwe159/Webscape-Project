const React = require("react");
const axios = require("axios").default;

//get all AMR data
export function AllAMRGenes() {
  const url = "http://localhost:8393/api/amr-sample";
  const [repo, setRepo] = React.useState([]);

  const getRepo = async () => {
    try {
      const res = await axios.get(url);
      if (res.statusText === "OK") {
        const myRepo = res.data.result;
        setRepo(myRepo);
      }
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getRepo();
  }, []);
  if (repo !== []) {
    return repo;
  }
}

//fetch data based on sample id
export function AMRGene(sample) {
  const url = `http://localhost:8393/api/amr-sample?samples=[${sample}]`;
  const [repo, setRepo] = React.useState([]);

  React.useEffect(() => {
    const getRepo = async () => {
      try {
        const res = await axios.get(url);
        if (res.statusText === "OK") {
          const myRepo = res.data.result;
          setRepo(myRepo);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getRepo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (repo !== undefined) {
    return repo;
  }
}

// a function for fetching data from API for Packed Circle Graph
export function PackedCircleData() {
  const url = "http://localhost:8393/api/packed-circle";
  const [repo, setRepo] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const getRepo = async () => {
      try {
        const res = await axios.get(url);
        if (res.statusText === "OK") {
          const myRepo = res.data.result;
          setRepo(myRepo);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getRepo();
  }, [setRepo]);
  if (repo !== undefined) {
    console.log(repo);
    return [repo, isLoading];
  }
}

export async function fetchPackedCircleData() {
  const url = "http://localhost:8393/api/packed-circle";
  const result = await fetch(url);
  const data = await result.json();
  return data.result;
}

export async function fetchSelectedSample(sampleId) {
  const amrTableUrl = `http://localhost:8393/api/amr-sample?samples=[${sampleId}]`;
  const sampleInfoUrl = `http://localhost:8393/api/sample-metadata?samples=[${sampleId}]`;

  const amrResult = await fetch(amrTableUrl);
  const amrTable = await amrResult.json();

  const sampleResult = await fetch(sampleInfoUrl);
  const sampleInfo = await sampleResult.json();
  return {
    amrTable,
    sampleInfo,
  };
}
