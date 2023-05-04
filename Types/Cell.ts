import { Point } from "./Point"
import { Wall } from "./Wall"

export interface Cell{
    sides: Wall[][]
    visited: boolean
    index: Point
    center: Point
}