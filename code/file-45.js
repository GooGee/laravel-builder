function run(data) {
    /** @type {DataForScript} */
    const ddd = data

    const linezz = []
    /** @type {Map<number, File[]>} */
    const parentMap = new Map()
    ddd.db.tables.File.forEach(item => {
        let found = parentMap.get(item.parentId)
        if (found === undefined) {
            found = []
            parentMap.set(item.parentId, found)
        }
        found.push(item)
    })

    const root = ddd.treeMap.get(1)
    dfs(root, 1)
    ddd.tree = linezz.join('\n')
    ddd.filezz = ddd.db.tables.File
        .map(item => '0000'.concat(item.id).slice(-4).concat(' ').concat(item.name))
        .join('\n')

    /**
     *
     * @param {LinkedTreeNode} node
     * @param {number} level
     */
    function dfs(node, level) {
        const line = '\t'.repeat(level).concat('+').concat('0000'.concat(node.id).slice(-4)).concat(' ').concat(node.name)
        linezz.push(line)

        node.childzz.forEach(item => dfs(item, level + 1))

        const filezz = parentMap.get(node.id)
        if (filezz) {
            filezz.forEach(item => {
                const line = '\t'.repeat(level + 1).concat('0000'.concat(item.id).slice(-4)).concat(' ').concat(item.name)
                linezz.push(line)
            })
        }
    }
}
