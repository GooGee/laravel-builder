function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    /**
     * write code below
     * it will be executed before generating files
     */

    ddd.type = 'string'
    let linezz = []
    /** @type {LB.Variable} */
    const entity = ddd.entity
    if (entity.type === 'string') {
        linezz = entity.enum.map((item) => `    case ${item} = '${item}';`)
    } else {
        if (entity.type === 'integer') {
            ddd.type = 'int'
            linezz = entity.enum.map((item) => `    case V${item} = ${item};`)
        } else {
            linezz = entity.enum.map((item) => `    case V${item.replace('.', '_')} = '${item}';`)
        }
    }
    ddd.text = linezz.join('\n')
}
