import chalk from 'chalk'
import boxen from 'boxen'

export const point = {
    step(msg: string) {
        console.log('📌 ' + msg)
    },
    save(msg: string) {
        console.log(chalk.greenBright(chalk.bold('⚙ '), msg))
    },
    header(msg: string) {
        msg = chalk.hex('#11998e')(boxen(msg, { borderStyle: 'round', padding: 1, margin: 1 }))
        console.log(msg)
    },
    total(msg: string) {
        console.log(chalk.white('🚥', msg))
    },
    message(msg: string): void {
        console.log(chalk.green('🔈', msg))
    },
    warn(msg: string): void {
        console.log(chalk.yellow('🚧', msg))
    },
    error(msg: string): void {
        console.log(chalk.red('👻', msg))
    },
    success(msg: string) {
        console.log(chalk.white('🎉', msg))
    },
    query(msg: string) {
        console.log(chalk.yellow('🔎', msg))
    }
}
