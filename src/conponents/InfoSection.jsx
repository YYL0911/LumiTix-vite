// 購票提醒資訊區域
const InfoSection = ({ id, title, items }) => (
  <div className="mb-lg-7 mb-4 sectionTop" id={id}>
    <div className="border border-2 border-Neutral-700 px-4 py-3 bg-Neutral-700">
      <h5 className="text-white fw-bold">{title}</h5>
    </div>
    <div className="border border-2 border-top-0 border-Neutral-700 px-lg-4 px-3 py-lg-6 py-4">
      <ul className="d-flex flex-column gap-lg-6 gap-4 mb-0">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  </div>
);

export default InfoSection;