import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';

// Workflow components
import WorkflowEditor from '../workflow/WorkflowEditor';

// Redux
import { RootState } from '../../store';
import { setCurrentWorkflowId, setWorkflowLoading } from '../../store/slices/workflowSlice';

/**
 * WorkflowEditorPage - Container component for the workflow editor
 * Handles workflow selection based on URL parameters and loading states
 */
const WorkflowEditorPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  
  // Select necessary state from Redux
  const isLoading = useSelector((state: RootState) => state.workflow.isLoading);
  
  // Set current workflow if ID is provided
  useEffect(() => {
    if (id) {
      dispatch(setWorkflowLoading(true));
      
      // In a real application, we would fetch the workflow data from the API here
      // For now, we'll just set the workflow ID and simulate the loading state
      dispatch(setCurrentWorkflowId(id));
      
      // Simulate API call completion
      setTimeout(() => {
        // In a real app, we would dispatch setCurrentWorkflow with the full workflow data
        // after receiving it from the API
        dispatch(setWorkflowLoading(false));
      }, 500);
    }
  }, [dispatch, id]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-t-accent-primary border-r-transparent border-b-accent-secondary border-l-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }
  
  // Render the main workflow editor component which handles all the editor UI
  return <WorkflowEditor />;
};

export default WorkflowEditorPage;