import { Point } from "./Point"

export const vectorLength = (ray: Point) =>{
    return Math.sqrt(Math.pow(ray.x, 2) + Math.pow(ray.y, 2)) + Math.pow(ray.z, 2)
}

export const subtractVectors = (a: Point, b: Point) =>{
    return {x: a.x - b.x, y: a.y - b.y, z: a.z - b.z}
}

export const addVectors = (a: Point, b: Point) =>{
    return {x: a.x + b.x, y: a.y + b.y, z: a.z + b.z}
}

export const scaleVector = (vector: Point, scale: number) =>{
    return {x: vector.x * scale, y: vector.y * scale, z: vector.z * scale}
}

export const rotateVector = (vector: Point, angle: number) =>{
    return {
        x: (Math.cos(angle) * vector.x) - (Math.sin(angle) * vector.y),
        y: (Math.sin(angle) * vector.x) + (Math.cos(angle) * vector.y),
        z: vector.z
    }
}

export const dotVectors = (a: Point, b: Point) =>{
    return (a.x * b.x) + (a.y * b.y) + (a.z * b.z)
}

export const getNormal = (vector: Point) =>{
    return {x: -vector.y, y: vector.x, z: vector.z}
}
//theta = arccos( (a dot b) / (|a| |b|) )
export const angleBetweenVectors = (a: Point, b: Point) =>{
    return Math.acos( dotVectors(a, b) / (vectorLength(a) * vectorLength(b)) )
}