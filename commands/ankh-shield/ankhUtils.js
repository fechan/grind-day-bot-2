const items = {
    'Obsidian Skull': 1,
    'Cobalt Shield': 2,
    'Trifold Map': 4,
    'Fast Clock': 8,
    'Vitamins': 16,
    'Armor Polish': 32,
    'Blindfold': 64,
    'Nazar': 128,
    'Megaphone': 256,
    'Bezoar': 512,
    'Adhesive Bandage': 1024,
    'Obsidian Shield': 2048,
    'The Plan': 4096,
    'Armor Bracing': 8192,
    'Countercurse Mantra': 16384,
    'Medicated Bandage': 32768,
    'Ankh Charm': 65536,
    'Ankh Shield': 131072
}

/*
    Generates a bitwise flag number from the initial checklist flags and an itemArray.
    If the operation is 'add' then it adds items in itemArray to initial
    If the operation is 'remove' then it removes items in itemArray from initial
*/
exports.itemFlags = function(initial, itemArray, operation) {
    let flags = initial;
    for (let item of itemArray) {
        for (let flagName of Object.keys(items)) {
            if (flagName.toLowerCase().replace(' ', '') === item.toLowerCase()) {
                if (operation === 'add') {
                    flags = flags | items[flagName];
                } else {
                    flags = flags & ~items[flagName];
                }
                break;
            }
        }
    }
    return flags;
}

/*
    Builds a checklist from flags, used for replying to the user
*/
exports.buildChecklistReply = function(flags){
    let reply = "**You have the following items:**\n";
    for (const itemName in items) {
        if (flags & items[itemName]) {
            reply += `✓  ${itemName}\n`;
        } else {
            reply += `\\_ ${itemName}\n`;
        }
    }
    return reply;
}

/*
    Deletes ankh_# roles in a guild that have no members
*/
exports.cleanupRoles = async function(guild) {
    for (let [roleId, role] of guild.roles.cache) {
        if (role.name.startsWith('ankh_') && role.members.size === 0) {
            await role.delete("Deleting Ankh Shield checklist role with no members.");
        }
    }
}
    
/*
    Removes all of a member's Ankh Shield checklists
*/
exports.removeChecklists = async function(member) {
    for (let [roleId, role] of member.roles.cache) {
        if (role.name.startsWith('ankh_')) {
            await member.roles.remove(role, "Taking old Ankh Shield checklist from " + member.nickname);
        }
    }
}

/*
    Replaces all of a member's Ankh Checklist roles (if any) with a new one determined by flags
    If the role doesn't already exist, it will create it first.
*/
exports.giveChecklist = async function(member, flags) {
    let name = 'ankh_' + flags;
    let role = member.guild.roles.cache.find(role => role.name === name);
    if (role === undefined) { //create the role if it doesn't exist
        let newRole = await member.guild.roles.create({
                data: {name: name},
                reason: `Creating new Ankh Shield checklist`
            });
        await member.roles.add(newRole, `Giving ${member.nickname} an Ankh Shield checklist`);
    } else {
        await member.roles.add(role, `Giving ${member.nickname} an Ankh Shield checklist`)
    }
}