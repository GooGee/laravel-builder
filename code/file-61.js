function run(data) {
    // resources/TypeScriptEnum.ts

    /** @type {LB.DataForScript} */
    const ddd = data

    const ignore = new Set(['ParameterInCookie', 'ParameterInHeader'])

    const linezz = []
    const entitySet = new Set()
    makeEntityEnum()
    makePermissionEnum()
    makeRoleEnum()
    ddd.text = linezz.join("\n")

    function makeEntityEnum() {
        const name = 'EntityEnum'
        linezz.push(`export enum ${name} {`)
        ddd.db.tables.Entity.filter(item => !ignore.has(item.name))
            .sort((aa, bb) => aa.name.localeCompare(bb.name))
            .forEach(item => makeLine(item.name))
        linezz.push('}')
        linezz.push('')
    }

    function makePermissionEnum() {
        const name = 'PermissionEnum'
        linezz.push(`export enum ${name} {`)

        const permissionzz = ddd.helper.makePermissionzz().filter(item => item.module === ddd.module.name)
        permissionzz.forEach(item => {
            entitySet.add(item.entity)
            makeLine(item.permission)
        })

        linezz.push('}')
        linezz.push('')
    }

    function makeRoleEnum() {
        const name = 'RoleEnum'
        linezz.push(`export enum ${name} {`)

        Array.from(entitySet).forEach(item => makeLine(item + 'Moderator'))

        linezz.push('}')
        linezz.push('')
    }

    function makeLine(name) {
        linezz.push(`    ${name} = "${name}",`)
    }
}
