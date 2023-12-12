#!node
function usage () {
    console.log(`${process.argv[1]} <scope>`)
    process.exit(1)
}
const scope = process.argv[2]; if (!scope) usage()
const fs = require('fs')
const pkg = JSON.parse(fs.readFileSync('./package.json'))
const checkExistsRe = new RegExp(`^${scope}/`, 'g')
// console.log(`name: ${pkg.name}, scope: ${scope}, re: ${checkExistsRe}`)
if (checkExistsRe.test(pkg.name)) {
    console.error(`already scoped to ${scope}`)
    process.exit(1)
}
pkg.name = `${scope}/${pkg.name}`
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2))
