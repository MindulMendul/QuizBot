const CmdtoName = async (map, component) => {
    const cmdList = component.cmd;
    const name = component.name;
    cmdList.forEach((e)=>{ map.set(e, name); });
}

module.exports = {CmdtoName};