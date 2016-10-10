import * as ProcApi from '../apis/Procs';

export function patchInstance(appName, procName, numInstance) {
  return {
    type: 'PATCH_PROC_INSTANCE_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => ProcApi.patchInstance(appName, procName, numInstance),
    payload: { appName, procName, numInstance },
  };
}

export function patchSpec(appName, procName, cpu, memory) {
  return {
    type: 'PATCH_PROC_SPEC_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => ProcApi.patchSpec(appName, procName, cpu, memory),
    payload: { appName, procName, cpu, memory },
  };
}

export function remove(appName, procName) {
  return {
    type: 'REMOVE_PROC_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => ProcApi.remove(appName, procName),
    payload: { appName, procName },
  };
}

export function deploy(appName, procName) {
  return {
    type: 'DEPLOY_PROC_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => ProcApi.deploy(appName, procName),
    payload: { appName, procName },
  };
}
