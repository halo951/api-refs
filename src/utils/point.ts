import chalk from 'chalk'
import { box } from './box'

export const point = {
    step(msg: string) {
        console.log('📌 ' + msg)
    },
    save(msg: string) {
        console.log(chalk.greenBright(chalk.bold('⚙ '), msg))
    },
    header(msg: string) {
        console.log(box(msg, { color: '#11998e' }))
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
