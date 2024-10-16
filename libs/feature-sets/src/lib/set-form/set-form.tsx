import React, { useState } from 'react';
import {
  useAddSetMutation,
  SetListDocument,
  SetListQuery,
} from '@team-flow/data-access';
import { TextField, Button, Box } from '@mui/material';

export const SetForm = () => {
  const [name, setName] = useState('');
  const [year, setYear] = useState(0);
  const [numParts, setNumParts] = useState(1000);

  const [addSetMutation] = useAddSetMutation({
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
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 300 }}
    >
      <TextField
        label="Name"
        variant="outlined"
        value={name}
        onChange={(event) => setName(event.target.value)}
        fullWidth
      />
      <TextField
        label="Year"
        type="number"
        variant="outlined"
        value={year}
        onChange={(event) => setYear(Number(event.target.value))}
        fullWidth
      />
      <TextField
        label="Number of Parts"
        type="number"
        variant="outlined"
        value={numParts}
        onChange={(event) => setNumParts(Number(event.target.value))}
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary">
        Create new set
      </Button>
    </Box>
  );
};

export default SetForm;
