<?php

require_once('PHPMailer/class.phpmailer.php');

class Mail{


    public function send_message($data, $email, $from, $from_name, $subject){
        if(!empty($_POST)){

            $message = $this->create_message($data);

            $mail = new PHPMailer();

            $mail->From = $from;    
            $mail->FromName = $from_name;  
            $mail->CharSet = 'UTF-8';
            $mail->AddAddress($email, $from_name); 
            $mail->IsHTML(true);        
            $mail->Subject = $subject;
            $mail->Body = $message;

            if (!$mail->Send()) die ('Mailer Error: '.$mail->ErrorInfo);

            echo json_encode(array('message' => 'Успешно отправлено','success' => 1));
        }
    }

    private function create_message($data){
        $message = '<table style="width:100%;border:3px solid #F44336;border-collapse: collapse;font-family:sans-serif">';
        $count = 1;

        foreach($data as $item => $value){
            if($value){
                if($count % 2 == 0){
                    $message = $message.'<tr><td style="padding:10px;background:#eee"><strong>'.$item.':</strong></td>';
                    $message = $message.'<td style="background:#eee">'.$value.'</td></tr>';
                }
                else{
                    $message = $message.'<tr><td style="padding:10px;"><strong>'.$item.':</strong></td>';
                    $message = $message.'<td>'.$value.'</td></tr>';
                }
                $count++;
            }
        }

        $message = $message.'</table>';

        return $message;
    }
}