export const generateLevelBoundaries = (dimensions: {
    width: number,
    height: number,
    offset?: number,
}) => {
    const {
        width,
        height,
        offset = 100,
    } = dimensions
    return [
        // top piece
        {
            x: width / 2,
            y: -offset / 2,
            width: width + offset * 2,
            height: offset,
        },
        // bottom piece
        {
            x: width / 2,
            y: height + offset / 2,
            width: width + offset * 2,
            height: offset,
        },
        // left piece
        {
            x: -offset / 2,
            y: height / 2,
            width: offset,
            height: height + offset * 2,
        },
        // right piece
        {
            x: width + offset / 2,
            y: height / 2,
            width: offset,
            height: height + offset * 2,
        },
    ]
}