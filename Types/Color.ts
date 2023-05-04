export const colorToString = (color: Color): string =>{
    return `rgba(${color.r},${color.g},${color.b},${color.a})`
}

export interface Color{
    r: number
    g: number
    b: number
    a: number
}