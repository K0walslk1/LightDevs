const LightEmbed = require('./LightEmbed')
module.exports = class Command {
    constructor (name, client) {
        this.name = name
        this.parent = ''
        this.client = client
        this.aliases = []
        this.category = 'normal'
        this.argsRequired = false
        this.usage = ''
        this.adminOnly = false
        this.subcommandsOnly = false
        this.invalidArgsMessage = 'Erro; Argumentos inválidos'

        this.subcommands = []
        this.examples = []
    }

    process (message, args) {
        if (this.adminOnly && message.author.id != '471333722810089492')
            return
        if (this.argsRequired && args.length === 0)
            return typeof this.invalidArgsMessage === 'function' ? this.invalidUsageMessage(message, args) : message.channel.send(this.invalidArgsMessage)
        
        let sub = this.subcommands.find(s => s.name === args[0] || s.aliases.includes(args[0]))
        
        if (sub)
            return sub.process(message, args.slice(1))
        else if (!sub && this.subcommandsOnly)
            return message.channel.send(this.embedHelpSUBS(message))
        else
            return this.run(message, args)
    }

    embedHelpSUBS (message) {
        const tag = `${message.prefix + this.name} ${this.usage}`
        let embed = new LightEmbed()
            .setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
            .setTitle('SubComandos')
            .setDescription(this.subcommands.map((c) => `\`${tag} ${c.name} ${c.usage}\` ${c.description}`).join('\n'))
            .setFooter(message.author.tag, message.author.displayAvatarURL())
            .setColor('RANDOM')
            .setTimestamp(new Date())
        return message.channel.send(embed)
    }
    run () {}
}