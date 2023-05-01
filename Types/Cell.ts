import { Point } from "./Point"

export interface Cell{
    sides: Point[][]
    visited: boolean
    index: Point
    center: Point
}