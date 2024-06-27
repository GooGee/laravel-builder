function run(data) {
    /** @type {LB.DataForScript} */
    const ddd = data

    /**
     * write code below
     * it will be executed before generating files
     */
    const linezz = ddd.db.tables.Entity
        .filter(item => item.isTable)
        .map(item => `    case ${item.name} = \\App\\Models\\${item.name}::class;`)
    ddd.text = linezz.join('\n')
}
