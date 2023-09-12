import { UnorderedList } from "@chakra-ui/react";
import PoolsListItem from "./PoolsListItem";

const PoolsList: React.FC = () => {
  return (
    <UnorderedList styleType="none" w="1080px" h="600px" m="0">
      <PoolsListItem />
      <PoolsListItem />
      <PoolsListItem />
      <PoolsListItem />
      <PoolsListItem />
    </UnorderedList>
  );
};

export default PoolsList;