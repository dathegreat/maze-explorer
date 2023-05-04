import { Color } from "../Types/Color"
import { Point } from "../Types/Point"

export interface Ray{
    origin: Point
    terminus: Point
    length: number
    color: Color
}