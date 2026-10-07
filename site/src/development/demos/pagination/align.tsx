// Adapted from Ant Design 5.29.3 (MIT), components/pagination/demo/align.tsx.
import { Pagination } from "antd-octane";

const App = () => (
  <>
    <Pagination align="start" defaultCurrent={1} total={50} />
    <br />
    <Pagination align="center" defaultCurrent={1} total={50} />
    <br />
    <Pagination align="end" defaultCurrent={1} total={50} />
  </>
);

export default App;
