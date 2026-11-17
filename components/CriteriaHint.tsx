// подсказка под карточкой цены на /services/pick: розовая плашка с жёлтой полосой слева.
// ml-[11px] — та же левая граница, что у карточки-сообщения (она сдвинута под «хвостик»)
export default function CriteriaHint({ title, text }: { title: string; text: string }) {
  return (
    <div className="ml-[11px] mt-3 rounded-l-lg rounded-r-2xl border border-l-4 border-[#f1c9cd] border-l-[#f5b800] bg-[#fff4f5] px-4 py-3">
      <p className="text-sm font-semibold leading-5 text-paper">{title}</p>
      <p className="mt-0.5 text-sm leading-5 text-[#5b6166]">{text}</p>
    </div>
  );
}
