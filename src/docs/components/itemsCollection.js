import { numberToArray } from "../../react-elastic-carousel/utils/helpers";
export default (numOfItems = 12) =>
  numberToArray(numOfItems).map(id => ({
    id,
    title: `This is item #${id + 1}`,
    description: `this is the description for item ${id + 1}`,
    img: `https://picsum.photos/450/250?${id}`
  }));
