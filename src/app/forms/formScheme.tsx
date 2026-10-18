import * as Yup from 'yup'

export interface FormProps {
    name: string;
    tags: string;
    file: string | Blob;
}

 export const formScheme: FormProps = { name: '', tags: '', file: ''}

 export const formValidationScheme = Yup.object().shape({
    name: Yup.string().trim()
    .required('Name is required')
    .max(50, 'Name must be at most 50 characters'),
    tags: Yup.string().trim()
    .required('Tags is required')
    .max(50, 'Tags must be at most 50 characters'),
    file: Yup.mixed<Blob>()
    .required('Select image to upload!')
    .test('size', 'File size cannot be higher than 5 MB', (file) => {
        return file.size < 5000000;
    })
    .test('type', 'Accepted formats are .jpg, .jpeg, .png, .gif', (file) => {
        return file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
     
 })
})   
