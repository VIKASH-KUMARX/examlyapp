import { Button, Toaster, Position } from '@blueprintjs/core';

const AppToaster = Toaster.create({
  position: Position.TOP,
});

export function DeleteAllStudentComponent({ API ,setRefresh }) {

  const deleteStudent = () => {
    fetch(API, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Delete failed');
        setRefresh(prev=>!prev);
        AppToaster.show({ message: 'All Student deleted!', intent: 'success', timeout: 2000});
      })
      .catch((err) =>{
        if(err.message==='Delete failed'){
          AppToaster.show({ message: err.message, intent: 'danger', timeout: 3000})
        } else{
          console.error("error in All student delete : ",err);
        }}
      );
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p style={{ marginBottom: '20px',fontWeight: 'bold' }}>
            Once confirmed, all student data will be permanently deleted and cannot be recovered.
        </p>
        <Button intent="danger" onClick={deleteStudent}>
            Confirm Delete
        </Button>
    </div>

  );
}