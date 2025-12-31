import { ConnectionEdge } from "../types/ConnectionEdge";
import { Coordinate } from "../types/coordinate";
import { getAbsoluteCoordinate } from "./getAbsoluteCoordinate";

export const getConnectionEdgeCoordinate = (
    nodeCoord : ReturnType<typeof getAbsoluteCoordinate>, 
    edge :ConnectionEdge
): Coordinate =>{

    const coord = {
        x : nodeCoord.x, y: nodeCoord.y
    }

    if(edge == "TOP"){
        coord.x = nodeCoord.mid.x;
        coord.y = nodeCoord.y;
    } else if (edge == "BOTTOM"){
        coord.x = nodeCoord.mid.x;
        coord.y = nodeCoord.y + nodeCoord.h;
    } else if (edge == "LEFT"){
        coord.x = nodeCoord.x;
        coord.y = nodeCoord.mid.y;
    }else if (edge == "RIGHT"){
        coord.x = nodeCoord.x + nodeCoord.w;
        coord.y = nodeCoord.mid.y;
    }

    return coord;
}