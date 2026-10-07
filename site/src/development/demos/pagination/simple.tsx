// Adapted from Ant Design 5.29.3 (MIT), components/pagination/demo/simple.tsx.
import { Pagination } from "antd-octane";

const App = () => (
  <>
    <Pagination simple defaultCurrent={2} total={50} />
    <br />
    <Pagination simple={{ readOnly: true }} defaultCurrent={2} total={50} />
    <br />
    <Pagination disabled simple defaultCurrent={2} total={50} />
  </>
);

export default App;
