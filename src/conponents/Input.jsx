const Input = ({ id, labelText, register, type, errors, rules, placeholderTet, disabled = false}) => {
  
    return (
      <>
        <label htmlFor={id} className={`form-label ${(rules) ? "required-label" : ""} `}>
          {labelText}
        </label>
        <input
          id={id}
          type={type}
          className={`form-control ${errors[id] && 'is-invalid'}`}
          {...register(id, rules)}
          placeholder= {placeholderTet}
          disabled={disabled}
        />
        {errors[id] && (
          <div className='invalid-feedback'>{errors[id]?.message}</div>
        )}
      </>
    );
};

export default Input;