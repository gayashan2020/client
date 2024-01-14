// studentConstants.js
export const GENDER_OPTIONS = [
    { value: '', label: 'None' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
  ];
  
  export const BATCH_OPTIONS = Array.from({length: 25}, (_, i) => {
    const year = 2000 + i;
    return { value: year.toString(), label: `Batch ${year}` };
  });

  export const FACULTY_OPTIONS = [
    { value: '', label: 'None' },
    { value: 'medical', label: 'Medical Faculty' },
    { value: 'engineering', label: 'Engineering Faculty' },
    { value: 'science', label: 'Science Faculty' },
    { value: 'arts', label: 'Arts Faculty' },
    { value: 'law', label: 'Law Faculty' },
    { value: 'business', label: 'Business Faculty' },
    { value: 'education', label: 'Education Faculty' },
  ];