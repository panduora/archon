import Moment from 'moment';

export default function ProcView(proc) {
  let wrapped = proc;

  wrapped.upCount = () => {
    return _(proc.pods).
      filter(p => p.status === 'True').
      value().length;
  };

  wrapped.lifescore = () => {
    return wrapped.upCount() * 100.0 / proc.numinstances;
  };

  return wrapped;
}
