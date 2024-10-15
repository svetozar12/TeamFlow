import React, { useState } from 'react';

import './set-form.css';
import {
  useAddSetMutation,
  SetListDocument,
  SetListQuery,
} from '@team-flow/data-access';

/* eslint-disable-next-line */
export interface SetFormProps {}

export const SetForm = (props: SetFormProps) => {
  const [name, setName] = useState('');
  const [year, setYear] = useState(0);
  const [numParts, setNumParts] = useState(1000);

  const [addSetMutation, _] = useAddSetMutation({
    variables: { name, year, numParts },
    update(cache, { data }) {
      if (!data) return;
      const { addSet } = data;
      const { allSets } = cache.readQuery({
        query: SetListDocument,
      }) as Required<SetListQuery>;
      cache.writeQuery({
        query: SetListDocument,
        data: { allSets: allSets?.concat([addSet]) },
      });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addSetMutation();
    setName('');
    setYear(0);
    setNumParts(1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:{' '}
        <input
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        ></input>
      </label>
      <br />
      <label>
        Year:{' '}
        <input
          name="year"
          type="number"
          value={year}
          onChange={(event) => setYear(Number(event.target.value))}
        ></input>
      </label>
      <br />
      <label>
        Number of Parts:{' '}
        <input
          name="numParts"
          value={numParts}
          onChange={(event) => setNumParts(+event.target.value)}
        ></input>
      </label>
      <br />
      <button>Create new set</button>
    </form>
  );
};

export default SetForm;
