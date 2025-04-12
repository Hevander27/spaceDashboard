import React from 'react';
import { useParams } from 'react-router-dom';
import ObjectDetail from '../components/ObjectDetail';

const DetailView = () => {
  const { objectName } = useParams();
  
  return (
    <div className="detail-view">
      <ObjectDetail objectName={objectName} />
    </div>
  );
};

export default DetailView;